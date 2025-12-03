import React from "react";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel"
}: ConfirmationPopupProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={`container-popup ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`container-popup-content ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
          <p className="text-secondary mb-8 leading-relaxed">{message}</p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="btn-primary flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="btn-secondary flex-1"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;