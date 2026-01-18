import React from "react";
import { Modal } from "../ui/Modal";
import { API_ENDPOINTS } from "../../config/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  title = "Log in to continue",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Please log in to join the discussion.
        </p>
        <button
          onClick={() => (window.location.href = API_ENDPOINTS.AUTH.GOOGLE)}
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
