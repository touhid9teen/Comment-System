import React, { useMemo } from 'react';
import type { CommentType, SortOption } from '../../types';
import { Comment } from './Comment';

interface CommentTreeProps {
  comments: CommentType[];
  sortOption?: SortOption;
  onReply: (parentId: string, text: string) => void;
  onReact: (commentId: string, type: 'like' | 'dislike') => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
}

export const CommentTree: React.FC<CommentTreeProps> = ({ 
  comments, 
  sortOption, 
  onReply, 
  onReact,
  onEdit,
  onDelete
}) => {
  // Sort comments based on option
  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    
    if (sortOption === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'most-liked') {
      sorted.sort((a, b) => b.likes.length - a.likes.length);
    } else if (sortOption === 'most-disliked') {
      sorted.sort((a, b) => b.dislikes.length - a.dislikes.length);
    }
    
    return sorted;
  }, [comments, sortOption]);

  return (
    <div className="comment-tree">
      {sortedComments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onReact={onReact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
