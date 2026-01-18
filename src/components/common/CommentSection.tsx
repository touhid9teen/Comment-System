import { useState } from "react";
import { MOCK_COMMENTS, sortOptions } from "../../data/variable";
import type { CommentType, SortOption } from "../../types/index";
import { Dropdown } from "../ui/Dropdown";
import "./comment-section.scss";
import { CommentInput } from "./commentInput";
import { CommentTree } from "./CommentTree";

export const CommentSection: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [comments, setComments] = useState<CommentType[]>(MOCK_COMMENTS);
  const handleCreateComment = (text: string) => {
    const newComment: CommentType = {
      id: Math.random().toString(36).substr(2, 9),
      userId: "u1",
      user: {
        id: "u1",
        name: "John Doe",
        avatarUrl: "",
        email: "john@example.com",
      },
      content: text,
      createdAt: new Date().toISOString(),
      parentId: null,
      likes: [],
      dislikes: [],
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleReply = () => {};

  const handleReaction = () => {};

  const handleEdit = () => {};

  const handleDelete = () => {};
  return (
    <div className="comment-section">
      <div className="comment-section__header">
        <h3>Comments</h3>
        <Dropdown
          items={sortOptions}
          selected={sortOption}
          onSelect={(val) => setSortOption(val as SortOption)}
          label="Sort by"
        />
      </div>
      <CommentInput onSubmit={handleCreateComment} />
      <div className="comment-section__list">
        <CommentTree
          comments={comments}
          sortOption={sortOption}
          onReply={handleReply}
          onReact={handleReaction}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
