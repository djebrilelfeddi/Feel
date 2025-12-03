import React, { useState } from "react";
import { StorageManager } from "../../../classes";
import { ConfirmationPopup } from "@ui";
import { translations } from "../../../../utils/translations";

interface HistoryButtonProps {
  onShowHistory: () => void;
  onClose: () => void;
  onClearHistory: () => void;
  language: 'fr' | 'en';
}

const HistoryButton = ({ onShowHistory, onClose, onClearHistory, language }: HistoryButtonProps) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const t = translations[language];

  const handleClearHistory = () => {
    setShowConfirmPopup(true);
  };

  const confirmClearHistory = () => {
    const storage = new StorageManager();
    storage.clear();
    onClearHistory();
  };

  return (
    <>
      <div className="pt-6 border-t border-white/20 space-y-3">
        <button
          onClick={() => {
            onClose();
            onShowHistory();
          }}
          className="btn-primary w-full"
        >
          {t.viewHistory}
        </button>
        <button
          onClick={handleClearHistory}
          className="btn-secondary w-full"
        >
          {t.clearHistory}
        </button>
      </div>

      <ConfirmationPopup
        isOpen={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={confirmClearHistory}
        title={t.confirmDelete}
        message={t.confirmDeleteMessage}
        confirmText={t.delete}
        cancelText={t.cancel}
      />
    </>
  );
};

export default HistoryButton;