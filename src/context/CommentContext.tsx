import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { CommentType, SortOption } from "../types";
import { commentService } from "../services/comment.service";

interface CommentContextType {
  comments: CommentType[]; // Top-level comments (or flat list depending on strategy)
  loading: boolean;
  error: string | null;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  fetchComments: () => Promise<void>;
  createComment: (content: string) => Promise<void>;
  replyToComment: (parentId: string, content: string) => Promise<void>;
  updateComment: (id: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  reactToComment: (id: string, type: "like" | "dislike") => Promise<void>;
  fetchReplies: (parentId: string) => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  // const { isAuthenticated } = useAuth();

  // Helper to recusively update the comment tree
  const updateCommentInTree = (
    list: CommentType[],
    id: string,
    updater: (comment: CommentType) => CommentType,
  ): CommentType[] => {
    return list.map((comment) => {
      if (comment.id === id) {
        return updater(comment);
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, id, updater),
        };
      }
      return comment;
    });
  };

  // Helper to recursively delete from tree
  const deleteCommentFromTree = (
    list: CommentType[],
    id: string,
  ): CommentType[] => {
    return list
      .filter((c) => c.id !== id)
      .map((c) => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, id) : [],
      }));
  };

  // Helper to find and add reply
  const addReplyToTree = (
    list: CommentType[],
    parentId: string,
    newReply: CommentType,
  ): CommentType[] => {
    return list.map((comment) => {
      // If this is the parent comment
      if (comment.id === parentId) {
        // Since we are replying to this comment, it must now have the new reply.
        // We ensure 'replies' array exists.
        return {
          ...comment,
          replies: [newReply, ...(comment.replies || [])],
          replyCount: (comment.replyCount || comment.replies?.length || 0) + 1,
        };
      }

      // If the comment has existing replies, we need to search recursively within them
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToTree(comment.replies, parentId, newReply),
          // Don't increment count here as it belongs to a child, unless we track total descendants?
          // Usually replyCount refers to direct children or total. If direct, stop.
          // If total, we should increment. Based on typical "Show X Replies", it usually means direct children of this node
          // OR the UI expects the updated node to reflect the change.
          // Let's assume standard behavior: The parent of the new reply gets incremented.
          // The current node is an ancestor. If we are traversing down, we don't necessarily increment the ancestor's count
          // unless it tracks distinct total replies. Let's stick to the direct parent update above.
        };
      }

      // Return unchanged comment otherwise
      return comment;
    });
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await commentService.getAll(sortOption);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", result);
      if (result.success) {
        // The backend returns { success: true, data: { comments: [], ... } }
        // We typed result.data as CommentType[] in service, but actual response checks show it's nested
        // Cast to any momentarily or fix the service type to reflect reality.
        const data: any = result.data;
        if (Array.isArray(data)) {
          setComments(data);
        } else if (data && Array.isArray(data.comments)) {
          setComments(data.comments);
        } else {
          setComments([]);
        }
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [sortOption]);

  // Initial fetch
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = async (content: string) => {
    try {
      const result = await commentService.create(content);
      console.log("Create Comment Result:", result);

      if (result.success) {
        // Handle potential nested data structure like { data: { comment: ... } } or just { data: ... }
        const data: any = result.data;
        const newComment = data.comment || data;

        // Check if the new comment has user info
        if (newComment.user && newComment.user.name) {
          // Initialize replyCount for consistency
          newComment.replyCount = 0;
          setComments((prev) => [newComment, ...prev]);
        } else {
          // If user data is missing (common in some APIs that don't populate on create), we must refetch or patch it manually
          // For now, let's just refetch to be safe and ensure UI consistency
          fetchComments();
        }
      }
    } catch (err) {
      console.error(err);
      // Optional: setError("Failed to create comment");
      throw err;
    }
  };

  const replyToComment = async (parentId: string, content: string) => {
    try {
      const result = await commentService.reply(parentId, content);
      console.log("Reply Result:", result);
      if (result.success) {
        const data: any = result.data;
        const newReply = data.comment || data;
        if (newReply.user && newReply.user.name) {
          setComments((prev) => addReplyToTree(prev, parentId, newReply));
          // Sync with server to ensure correct count and data consistency
          fetchReplies(parentId);
        } else {
          // If immediate response is partial, fetch just the replies for this parent to update the tree node
          fetchReplies(parentId);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateComment = async (id: string, content: string) => {
    try {
      const result = await commentService.update(id, content);
      console.log("Update Result:", result);
      if (result.success) {
        const data: any = result.data;
        const updatedComment = data.comment || data;
        setComments((prev) =>
          updateCommentInTree(prev, id, (c) => ({
            ...c,
            content: updatedComment.content,
          })),
        );
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteComment = async (id: string) => {
    try {
      // Optimistic delete
      setComments((prev) => deleteCommentFromTree(prev, id));
      await commentService.delete(id);
    } catch (err) {
      console.error(err);
      // Revert if needed, but for now we basically assume success or refetch
      fetchComments();
    }
  };

  const reactToComment = async (id: string, type: "like" | "dislike") => {
    try {
      const result = await commentService.react(id, type);
      console.log("React Result:", result);
      if (result.success) {
        const data: any = result.data;
        const updatedStats = data.comment || data; // Assuming it returns the updated comment or stats

        setComments((prev) =>
          updateCommentInTree(prev, id, (c) => ({
            ...c,
            likes: updatedStats.likes,
            dislikes: updatedStats.dislikes,
          })),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReplies = async (parentId: string) => {
    try {
      const result = await commentService.getReplies(parentId);
      if (result.success) {
        // Cast as necessary based on unknown structure (similar to other endpoints)
        const data: any = result.data;
        let replies = [];

        if (Array.isArray(data)) {
          replies = data;
        } else if (data && Array.isArray(data.comments)) {
          replies = data.comments;
        }

        // Update the tree with fetched replies
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: replies,
                replyCount: replies.length,
              };
            }
            // If we supported deep nesting fetch, we'd search recursively.
            // For now, assume we fetch replies for a known comment in the tree.
            // Recursive search for parentId:
            const updateReplies = (list: CommentType[]): CommentType[] => {
              return list.map((c) => {
                if (c.id === parentId) {
                  return { ...c, replies: replies };
                }
                if (c.replies) {
                  return { ...c, replies: updateReplies(c.replies) };
                }
                return c;
              });
            };
            return updateReplies([comment])[0];
          }),
        );
      }
    } catch (err) {
      console.error("Failed to fetch replies", err);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        error,
        sortOption,
        setSortOption,
        fetchComments,
        createComment,
        replyToComment,
        updateComment,
        deleteComment,
        reactToComment,
        fetchReplies,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
