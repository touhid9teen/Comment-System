import React from 'react';
import { Avatar } from '../components/ui/Avatar';
import './home.scss';
import { UpvoteIcon, DownvoteIcon, CommentIcon } from '../components/ui/Icons';

export const Home: React.FC = () => {
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
          <p>This is a demo post to showcase the commenting system implementation!</p>
          <div className="post-image-placeholder">
              Post Image Content
          </div>
        </div>

        {/* Post Stats */}
        <div className="post-stats">
           <span>1.2K Likes</span>
           <span>45 Comments</span>
        </div>

        {/* Post Actions */}
        <div className="post-actions">
           <button className="action-btn"><UpvoteIcon /> 1.2K</button>
           <button className="action-btn"><DownvoteIcon /> 6</button>
           <button className="action-btn"><CommentIcon /> 45</button>
        </div>

      </div>
    </div>
  );
};
