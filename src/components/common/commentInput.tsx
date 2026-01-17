import React, { useState } from "react";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../ui/Modal";
import "./comment-input.scss";

interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = "Type comment here...",
  autoFocus,
}) => {
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    onSubmit(text);
    setText("");
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  return (
    <div className={`comment-input-block ${isFocused ? "focused" : ""}`}>
      <div className="comment-input-header">
        {/* Mock Dropdown */}
        <h1 className="heading">Add Comment</h1>
      </div>

      <div className="comment-input-body">
        <textarea
          className="comment-textarea"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => !text && setIsFocused(false)}
          rows={4}
          autoFocus={autoFocus}
        />
      </div>

      <div className="comment-input-footer">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!text.trim()}
        >
          Comment
        </button>
      </div>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Log in to comment"
      >
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
    </div>
  );
};
