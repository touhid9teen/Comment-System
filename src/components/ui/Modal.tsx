import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./modal.scss";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  isOpen: boolean;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  isOpen,
  title,
}) => {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
