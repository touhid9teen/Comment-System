import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "./AuthModal";
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
  const [isFocused, setIsFocused] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsFocused(true);
  };

  return (
    <>
      <div className={`comment-input-block ${isFocused ? "focused" : ""}`}>
        <div className="comment-input-header">
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
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Log in to comment"
      />
    </>
  );
};
