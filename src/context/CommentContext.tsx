import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { CommentType, SortOption } from "../types";
import { commentService } from "../services/comment.service";
import { useSocket } from "./SocketContext";

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
  hasMore: boolean;
  loadMoreComments: () => Promise<void>;
  totalComments: number;
  currentPage: number;
  totalPages: number;
  navigateToPage: (page: number) => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const { socket } = useSocket();
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
  // Helper to find and add reply (preventing duplicates)
  const addReplyToTree = (
    list: CommentType[],
    parentId: string,
    newReply: CommentType,
  ): CommentType[] => {
    return list.map((comment) => {
      // If this is the parent comment
      if (comment.id === parentId) {
        // Check for duplicate
        if (comment.replies?.some((r) => r.id === newReply.id)) {
          return comment;
        }
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
        };
      }

      // Return unchanged comment otherwise
      return comment;
    });
  };

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const fetchComments = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      setLoading(true);
      try {
        const result = await commentService.getAll(sortOption, pageNum);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", result);
        if (result.success) {
          const {
            comments: newComments,
            total,
            totalPages: pages,
          } = result.data;

          setTotalComments(total);
          setTotalPages(pages);
          setPage(pageNum);

          if (append) {
            setComments((prev) => [...prev, ...newComments]);
          } else {
            setComments(newComments);
          }
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    },
    [sortOption],
  );

  // Initial fetch
  useEffect(() => {
    fetchComments(1, false);
  }, [fetchComments]);

  const loadMoreComments = async () => {
    if (page < totalPages) {
      await fetchComments(page + 1, true);
    }
  };

  const navigateToPage = async (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== page) {
      await fetchComments(pageNum, false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleCommentCreated = (newComment: CommentType) => {
      console.log("Socket: comment:created", newComment);
      if (!newComment.parentId) {
        setComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return [newComment, ...prev];
        });
      } else {
        setComments((prev) =>
          addReplyToTree(prev, newComment.parentId!, newComment),
        );
      }
    };

    const handleCommentUpdated = (updatedComment: CommentType) => {
      console.log("Socket: comment:updated", updatedComment);
      setComments((prev) =>
        updateCommentInTree(prev, updatedComment.id, (c) => ({
          ...c,
          ...updatedComment,
          // Preserve important fields that might be missing or unpopulated in the update payload
          user:
            updatedComment.user &&
            typeof updatedComment.user === "object" &&
            updatedComment.user.name
              ? updatedComment.user
              : c.user,
          userId: updatedComment.userId || c.userId,
          // Updates to content/likes shouldn't wipe out the replies tree
          replies: c.replies,
        })),
      );
    };

    const handleCommentDeleted = (payload: string | { id: string }) => {
      console.log("Socket: comment:deleted", payload);
      const commentId = typeof payload === "string" ? payload : payload.id;
      setComments((prev) => deleteCommentFromTree(prev, commentId));
    };

    const handleReacted = (updatedComment: CommentType) => {
      console.log("Socket: comment:reacted", updatedComment);
      handleCommentUpdated(updatedComment);
    };

    socket.on("comment:created", handleCommentCreated);
    socket.on("comment:reply", handleCommentCreated); // Treat as created
    socket.on("comment:updated", handleCommentUpdated);
    socket.on("comment:deleted", handleCommentDeleted);
    socket.on("comment:reacted", handleReacted);

    return () => {
      socket.off("comment:created", handleCommentCreated);
      socket.off("comment:reply", handleCommentCreated);
      socket.off("comment:updated", handleCommentUpdated);
      socket.off("comment:deleted", handleCommentDeleted);
      socket.off("comment:reacted", handleReacted);
    };
  }, [socket]);

  const createComment = async (content: string) => {
    try {
      const result = await commentService.create(content);
      console.log("Create Comment Result:", result);

      if (result.success) {
        // Handle potential nested data structure like { data: { comment: ... } } or just { data: ... }
        const data = result.data as unknown as
          | { comment: CommentType }
          | CommentType;
        const newComment =
          (data as { comment: CommentType }).comment || (data as CommentType);

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
        const data = result.data as unknown as
          | { comment: CommentType }
          | CommentType;
        const newReply =
          (data as { comment: CommentType }).comment || (data as CommentType);
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
        const data = result.data as unknown as
          | { comment: CommentType }
          | CommentType;
        const updatedComment =
          (data as { comment: CommentType }).comment || (data as CommentType);
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
        const data = result.data as unknown as
          | { comment: CommentType }
          | CommentType;
        const updatedStats =
          (data as { comment: CommentType }).comment || (data as CommentType);

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
        const data = result.data as unknown as
          | { comments: CommentType[] }
          | CommentType[];
        let replies: CommentType[] = [];

        if (Array.isArray(data)) {
          replies = data;
        } else if (
          data &&
          Array.isArray((data as { comments: CommentType[] }).comments)
        ) {
          replies = (data as { comments: CommentType[] }).comments;
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
        hasMore: page < totalPages,
        loadMoreComments,
        totalComments,
        currentPage: page,
        totalPages,
        navigateToPage,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
