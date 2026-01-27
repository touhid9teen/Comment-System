import React from "react";
import { Modal } from "../ui/Modal";
import { API_ENDPOINTS } from "../../config/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

import { useLoader } from "../../context/LoaderContext";

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  title = "Log in to continue",
}) => {
  const { showLoader } = useLoader();

  const handleGoogleLogin = () => {
    onClose(); // Close modal first
    showLoader();
    setTimeout(() => {
      window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
    }, 1500); // 1.5s delay
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Please log in to join the discussion.
        </p>
        <button
          onClick={handleGoogleLogin}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 500,
            color: "#444",
          }}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: 18 }}
          />
          Sign in with Google
        </button>
      </div>
    </Modal>
  );
};
