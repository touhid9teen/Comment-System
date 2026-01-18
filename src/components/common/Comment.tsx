import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import type { CommentType } from "../../types";
import { UpvoteIcon, DownvoteIcon, CommentIcon, ReplyIcon } from "../ui/Icons";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "./AuthModal";
import "./comment.scss";
import { useComments } from "../../context/CommentContext";

interface CommentProps {
  comment: CommentType;
  onReply: (parentId: string, text: string) => void;
  onReact: (commentId: string, type: "like" | "dislike") => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  depth?: number; // Track nesting depth
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onReact,
  onEdit,
  onDelete,
  depth = 0, // Default to 0 for root-level comments
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const hasLiked = user ? comment.likes.includes(user.id) : false;
  const hasDisliked = user ? comment.dislikes.includes(user.id) : false;
  const isOwner = user?.id === comment.userId;

  const netVotes = comment.likes.length - comment.dislikes.length;

  // Limit visual nesting to depth 1 (after first reply, keep everything at the same level)
  const isNestedBeyondLimit = depth >= 1;
  const nextDepth = depth + 1;

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsReplying(!isReplying);
  };

  const handleReactClick = (type: "like" | "dislike") => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    onReact(comment.id, type);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      await onReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
      setAreRepliesVisible(true); // Auto show replies after replying
    } catch (error) {
      console.error("Failed to reply:", error);
      // Optional: show a toast or error state here
    }
  };

  const handleEditSave = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const { fetchReplies } = useComments();
  const numReplies = comment.replyCount || comment.replies?.length || 0;

  const toggleReplies = () => {
    if (!areRepliesVisible) {
      // logic to fetch if not present
      if (
        numReplies > 0 &&
        (!comment.replies || comment.replies.length === 0)
      ) {
        fetchReplies(comment.id);
      }
    }
    setAreRepliesVisible(!areRepliesVisible);
  };

  return (
    <div className={`comment ${isNestedBeyondLimit ? "comment--flat" : ""}`}>
      <div className="comment__container">
        <div className="comment__avatar">
          <Avatar
            src={comment.user?.avatarUrl}
            fallback={comment.user?.name?.[0] || "?"}
            size="md"
          />
        </div>

        <div className="comment__main">
          <div className="comment__header">
            <span className="comment__author">
              {comment.user?.name || "Unknown User"}
            </span>
            {/* Mock Badge */}

            <span className="comment-time">
              {(() => {
                try {
                  return comment.createdAt
                    ? formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })
                    : "just now";
                } catch (e) {
                  return "just now";
                }
              })()}
            </span>
          </div>

          <div className="comment__body">
            {isEditing ? (
              <div className="comment__edit">
                <textarea
                  className="comment__edit-textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoFocus
                />
                <div className="comment__edit-actions">
                  <button
                    className="btn btn-cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-save" onClick={handleEditSave}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="comment__text">{comment.content}</p>
            )}
          </div>

          <div className="comment__footer">
            <div className="comment__votes">
              <button
                className={`vote-btn ${hasLiked ? "active" : ""}`}
                onClick={() => handleReactClick("like")}
                title="Upvote"
              >
                <UpvoteIcon size={18} />
              </button>
              <span
                className={`vote-count ${netVotes > 0 ? "positive" : netVotes < 0 ? "negative" : ""}`}
              >
                {netVotes}
              </span>
              <button
                className={`vote-btn ${hasDisliked ? "active" : ""}`}
                onClick={() => handleReactClick("dislike")}
                title="Downvote"
              >
                <DownvoteIcon size={18} />
              </button>
            </div>

            <div className="comment__divider"></div>

            {/* Toggle Replies Button */}
            {numReplies > 0 && (
              <button className="action-btn" onClick={toggleReplies}>
                <CommentIcon size={16} />
                {areRepliesVisible
                  ? "Hide Replies"
                  : `Show ${numReplies} Replies`}
              </button>
            )}

            <button className="action-btn reply-btn" onClick={handleReplyClick}>
              <ReplyIcon size={16} />
              Reply
            </button>

            {/* Owner Actions */}
            {isOwner && (
              <div className="comment__owner-actions">
                <button
                  className="action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => onDelete && onDelete(comment.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Inline Reply Input */}
          {isReplying && (
            <div className="comment__inline-reply">
              <div className="inline-reply-wrapper">
                <input
                  type="text"
                  className="inline-reply-input"
                  placeholder="Write a reply..."
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                />
              </div>
              <div className="inline-reply-actions">
                <button
                  className="btn btn-cancel btn-sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-save btn-sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {areRepliesVisible && numReplies > 0 && (
            <div className="comment__replies">
              {comment.replies?.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onReact={onReact}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  depth={nextDepth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Log in to join the conversation"
      />
    </div>
  );
};
