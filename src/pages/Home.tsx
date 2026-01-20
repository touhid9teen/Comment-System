import { useState } from "react";
import { AuthModal } from "../components/common/AuthModal";
import { CommentSection } from "../components/common/CommentSection";
import { Avatar } from "../components/ui/Avatar";
import { CommentIcon } from "../components/ui/Icons";
import { useComments } from "../context/CommentContext";
import "./home.scss";

export const Home: React.FC = () => {
  const [showComments, setShowComments] = useState(false);
  const { totalComments } = useComments();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="home-page">
      <div className="post-card">
        {/* Post Header */}
        <div className="post-header">
          <Avatar src="https://github.com/facebook.png" fallback="F" />
          <div className="post-info">
            <span className="author-name">Facebook Page</span>
            <span className="post-time">2 hours ago</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="post-content">
          <p>
            This is a demo post to showcase the commenting system
            implementation!
          </p>
          <div className="post-image-placeholder">Post Image Content</div>
        </div>

        {/* Post Stats */}
        {/* <div className="post-stats">
          <span>1.2K Likes</span>
          <span>45 Comments</span>
        </div> */}

        {/* Post Actions */}
        <div className="post-actions">
          {/* <button
            className="action-btn"
            onClick={() => handleActionClick(() => {})}
          >
            <UpvoteIcon /> 1.2K
          </button>
          <button
            className="action-btn"
            onClick={() => handleActionClick(() => {})}
          >
            <DownvoteIcon /> 6
          </button> */}
          <button
            className="action-btn"
            onClick={() => {
              setShowComments(!showComments);
            }}
          >
            <CommentIcon />{" "}
            {showComments ? "Hide Comments" : `${totalComments} Comments`}
          </button>
        </div>

        {/* Comment Section - Toggle visibility */}
        {showComments && (
          <div className="post-comments-container">
            <CommentSection />
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Log in to continue"
      />
    </div>
  );
};
