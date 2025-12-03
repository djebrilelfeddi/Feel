import React from "react";
import { ConversationEntry } from "../../types/types";

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: ConversationEntry[];
}

const ConversationHistory = ({ isOpen, onClose, history }: ConversationHistoryProps) => {
  if (!isOpen) return null;

  return (
    <div className="container-popup">
      <div className="container-glass max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col hover-lift">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-title">Historique des conversations</h2>
          <button
            onClick={onClose}
            className="btn-close"
            title="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="layout-history">
          {history.length === 0 ? (
            <div className="layout-empty">
              <p className="text-secondary text-lg">Aucune conversation sauvegardée.</p>
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="container-history-entry">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-secondary text-sm">
                      {new Date(entry.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary text-sm">Intensité: {entry.geminiResponse.intensity}/10</p>
                  </div>
                </div>

                <div className="container-history-grid">
                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-3 drop-shadow-md">Message utilisateur :</h4>
                    <p className="container-history-item text-white/90">"{entry.userMessage}"</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-3 drop-shadow-md">Analyse IA :</h4>
                    <div className="container-history-item space-y-3">
                      <div className="flex justify-between"><strong className="text-white/90">Humeur :</strong> <span className="text-white">{entry.geminiResponse.mood}</span></div>
                      <div className="flex justify-between"><strong className="text-white/90">Emoji :</strong> <span className="text-2xl">{entry.geminiResponse.emoji}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-3 drop-shadow-md">Réponse de soutien :</h4>
                    <div className="container-history-item container-history-text text-white/90">
                      {entry.geminiResponse.supportMessage}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-2 drop-shadow-md">Résumé du contexte :</h4>
                    <p className="container-history-item italic text-white/90 ">
                      {entry.contextSummary}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;