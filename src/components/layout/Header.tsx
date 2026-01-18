import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { AuthModal } from "../common/AuthModal";

import "./header.scss";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="app-header">
        <div className="container">
          <h1 className="logo">SocialApp</h1>
          <div className="header-actions">
            {!loading && (
              <>
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
                  <button onClick={handleLoginClick} className="login-btn">
                    Login
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Welcome Back"
      />
    </>
  );
};
