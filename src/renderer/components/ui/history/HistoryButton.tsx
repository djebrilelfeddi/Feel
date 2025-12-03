import React, { useState } from "react";
import { StorageManager } from "../../../classes";
import { ConfirmationPopup } from "@ui";

interface HistoryButtonProps {
  onShowHistory: () => void;
  onClose: () => void;
  onClearHistory: () => void;
}

const HistoryButton = ({ onShowHistory, onClose, onClearHistory }: HistoryButtonProps) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

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
          Voir l'historique des conversations
        </button>
        <button
          onClick={handleClearHistory}
          className="btn-secondary w-full"
        >
          Effacer l'historique
        </button>
      </div>

      <ConfirmationPopup
        isOpen={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={confirmClearHistory}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir effacer tout l'historique des conversations ? Cette action est irréversible."
        confirmText="Effacer"
        cancelText="Annuler"
      />
    </>
  );
};

export default HistoryButton;