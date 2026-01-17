import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import type { CommentType } from '../../types';
import { UpvoteIcon, DownvoteIcon, CommentIcon, ReplyIcon } from '../ui/Icons';
import { Avatar } from '../ui/Avatar';
import './comment.scss';

interface CommentProps {
  comment: CommentType;
  onReply: (parentId: string, text: string) => void;
  onReact: (commentId: string, type: 'like' | 'dislike') => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
}

export const Comment: React.FC<CommentProps> = ({ comment, onReply, onReact, onEdit, onDelete }) => {

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const user = {id: '1'}
  
  const hasLiked = user ? comment.likes.includes(user.id) : false;
  const hasDisliked = user ? comment.dislikes.includes(user.id) : false;
  const isOwner = user?.id === comment.userId;
  
  const netVotes = comment.likes.length - comment.dislikes.length;

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setIsReplying(false);
    setAreRepliesVisible(true); // Auto show replies after replying
  };

  const handleEditSave = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

 

  const numReplies = comment.replies?.length || 0;

  return (
    <div className="comment">
      <div 
        className="comment__container"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="comment__avatar">
           <Avatar src={comment.user.avatarUrl} fallback={comment.user.name[0]} size="md" />
        </div>

        <div className="comment__main">
          <div className="comment__header">
            <span className="comment__author">{comment.user.name}</span>
            {/* Mock Badge */}
            <span className="comment__badge">🔷</span> 
            <span className="comment__time">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
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
                  <button className="btn btn-cancel" onClick={() => setIsEditing(false)}>
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
                  className={`vote-btn ${hasLiked ? 'active' : ''}`}
                  onClick={() => onReact(comment.id, 'like')}
                  title="Upvote"
                >
                  <UpvoteIcon size={18} />
                </button>
                <span className={`vote-count ${netVotes > 0 ? 'positive' : netVotes < 0 ? 'negative' : ''}`}>
                  {netVotes}
                </span>
                <button 
                  className={`vote-btn ${hasDisliked ? 'active' : ''}`}
                  onClick={() => onReact(comment.id, 'dislike')}
                  title="Downvote"
                >
                  <DownvoteIcon size={18} />
                </button>
             </div>

             <div className="comment__divider"></div>

             {/* Toggle Replies Button */}
             {numReplies > 0 && (
                <button 
                  className="action-btn"
                  onClick={() => setAreRepliesVisible(!areRepliesVisible)}
                >
                  <CommentIcon size={16} />
                  {areRepliesVisible ? 'Hide Replies' : `Show ${numReplies} Replies`}
                </button>
             )}

             <button 
               className="action-btn reply-btn" 
               onClick={() => setIsReplying(!isReplying)}
             >
               {!numReplies && <ReplyIcon size={16} />} 
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
                   onClick={() => setShowDeleteConfirm(true)}
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
                      if (e.key === 'Enter' && !e.shiftKey) {
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
        </div>
      </div>  
    </div>
  );
};
