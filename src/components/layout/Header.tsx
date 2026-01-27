import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { AuthModal } from "../common/AuthModal";
import { Loader } from "../ui/Loader";
import { useLoader } from "../../context/LoaderContext";

import "./header.scss";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    showLoader();
    setTimeout(async () => {
      await logout();
      hideLoader();
    }, 1500); // 1.5s delay
  };

  return (
    <>
      <header className="app-header">
        <div className="container">
          <h1 className="logo">SocialApp</h1>
          <div className="header-actions">
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                {isAuthenticated && user ? (
                  <>
                    <div className="user-info">
                      <Avatar src={user.avatarUrl} size="sm" />
                      <span className="user-name">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
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
