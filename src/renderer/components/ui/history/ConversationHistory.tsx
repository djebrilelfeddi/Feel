import React from "react";
import { ConversationEntry } from "../../types/types";
import { translations } from "../../../../utils/translations";

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: ConversationEntry[];
  language: 'fr' | 'en';
}

const ConversationHistory = ({ isOpen, onClose, history, language }: ConversationHistoryProps) => {
  const t = translations[language];
  const dateLocale = language === 'fr' ? 'fr-FR' : 'en-US';

  if (!isOpen) return null;

  return (
    <div className="container-popup">
      <div className="container-glass max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col hover-lift">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-title">{t.historyTitle}</h2>
          <button
            onClick={onClose}
            className="btn-close"
            title={t.close}
          >
            ✕
          </button>
        </div>
        <div className="layout-history">
          {history.length === 0 ? (
            <div className="layout-empty">
              <p className="text-secondary text-lg">{t.noHistory}</p>
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="container-history-entry">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-secondary text-sm">
                      {new Date(entry.timestamp).toLocaleString(dateLocale)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary text-sm">{t.intensity}: {entry.geminiResponse.intensity}/10</p>
                  </div>
                </div>

                <div className="container-history-grid">
                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-3 drop-shadow-md">{t.userMessage}:</h4>
                    <p className="container-history-item text-white/90">"{entry.userMessage}"</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-3 drop-shadow-md">{t.aiAnalysis}:</h4>
                    <div className="container-history-item space-y-3">
                      <div className="flex justify-between"><strong className="text-white/90">{t.mood}:</strong> <span className="text-white">{entry.geminiResponse.mood}</span></div>
                      <div className="flex justify-between"><strong className="text-white/90">{t.emoji}:</strong> <span className="text-2xl">{entry.geminiResponse.emoji}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-3 drop-shadow-md">{t.supportResponse}:</h4>
                    <div className="container-history-item container-history-text text-white/90">
                      {entry.geminiResponse.supportMessage}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-white/90 mb-2 drop-shadow-md">{t.contextSummary}:</h4>
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