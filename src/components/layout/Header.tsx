import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";

import "./header.scss";
import { API_ENDPOINTS } from "../../config/api";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const handleGoogleLogin = () => {
      // Redirect to backend Google OAuth endpoint
      window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
    };

  return (
    <header className="app-header">
      <div className="container">
        <h1 className="logo">SocialApp</h1>
        <div className="header-actions">
          {isAuthenticated && user ? (
            <>
              <div className="user-info">
                <Avatar src={user.avatarUrl} size="sm" />
                <span>{user.name}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                Log Out
              </button>
            </>
          ) : (
            <button onClick={handleGoogleLogin} className="login-btn">
              Login
            </button>         
          )}
        </div>
      </div>
    </header>
  );
};
