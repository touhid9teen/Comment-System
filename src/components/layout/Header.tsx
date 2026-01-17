import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";

import "./header.scss";
import { GoogleLoginButton } from "../common/GoogleLoginButton";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

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
            <GoogleLoginButton />
          )}
        </div>
      </div>
    </header>
  );
};
