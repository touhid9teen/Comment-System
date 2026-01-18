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
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [newReply, ...(comment.replies || [])],
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: addReplyToTree(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await commentService.getAll(sortOption);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", result);
      if (result.success) {
        setComments(result.data);
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
      if (result.success) {
        setComments((prev) => [result.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const replyToComment = async (parentId: string, content: string) => {
    try {
      const result = await commentService.reply(parentId, content);
      if (result.success) {
        setComments((prev) => addReplyToTree(prev, parentId, result.data));
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateComment = async (id: string, content: string) => {
    try {
      const result = await commentService.update(id, content);
      if (result.success) {
        setComments((prev) =>
          updateCommentInTree(prev, id, (c) => ({
            ...c,
            content: result.data.content,
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
    // Optimistic update could be complex without user ID, so we'll wait for server for accuracy
    // OR we can guess if we have the current user ID.
    // Let's rely on server response for now to ensure consistency,
    // but typically we'd do optimistic updates for "snappiness".
    try {
      const result = await commentService.react(id, type);
      if (result.success) {
        setComments((prev) =>
          updateCommentInTree(prev, id, (c) => ({
            ...c,
            likes: result.data.likes,
            dislikes: result.data.dislikes,
          })),
        );
      }
    } catch (err) {
      console.error(err);
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
