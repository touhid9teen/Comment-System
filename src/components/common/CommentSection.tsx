import { sortOptions } from "../../data/variable";
import type { SortOption } from "../../types/index";
import { useComments } from "../../context/CommentContext";
import { Dropdown } from "../ui/Dropdown";
import "./comment-section.scss";
import { CommentInput } from "./commentInput";
import { CommentTree } from "./CommentTree";

import { Pagination } from "../ui/Pagination";
import { Loader } from "../ui/Loader";

export const CommentSection: React.FC = () => {
  const {
    comments,
    sortOption,
    setSortOption,
    createComment,
    replyToComment,
    updateComment,
    deleteComment,
    reactToComment,
    loading,
    error,
    currentPage,
    totalPages,
    navigateToPage,
  } = useComments();

  if (error) {
    return <div className="comment-section-error">{error}</div>;
  }

  return (
    <div className="comment-section">
      <div className="comment-section__header">
        <h3>Comments ({comments.length})</h3>
        {/* Comment count could be recursive count in a real app, but for now length of root is fine or need total count from API */}
        <Dropdown
          items={sortOptions}
          selected={sortOption}
          onSelect={(val) => setSortOption(val as SortOption)}
          label="Sort by"
        />
      </div>
      <CommentInput onSubmit={createComment} />
      <div className="comment-section__list">
        {loading && comments.length === 0 ? (
          <Loader size="lg" fullScreen />
        ) : comments.length === 0 ? (
          <div className="comment-section-empty">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <CommentTree
            comments={comments}
            sortOption={sortOption}
            onReply={replyToComment}
            onReact={reactToComment}
            onEdit={updateComment}
            onDelete={deleteComment}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={navigateToPage}
        />
      </div>
    </div>
  );
};
