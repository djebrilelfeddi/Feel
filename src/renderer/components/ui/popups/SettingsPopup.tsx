import React from "react";
import { LanguageSelector, ModelSelector, TypewriterSpeedControl } from "../settings";
import { HistoryButton } from "../history";
import { translations } from "../../../../utils/translations";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
  typewriterSpeed: number;
  onTypewriterSpeedChange: (speed: number) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onShowHistory: () => void;
  onClearHistory: () => void;
}

const SettingsPopup = ({ isOpen, onClose, language, onLanguageChange, typewriterSpeed, onTypewriterSpeedChange, selectedModel, onModelChange, onShowHistory, onClearHistory }: SettingsPopupProps) => {
  const t = translations[language];

  return (
    <div className={`container-popup ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`container-glass ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-title">{language === 'fr' ? 'Paramètres' : 'Settings'}</h2>
          <button
            onClick={onClose}
            className="btn-close"
            title={t.close}
          >
            ✕
          </button>
        </div>
        <div className="space-y-6">
          <LanguageSelector
            language={language}
            onLanguageChange={onLanguageChange}
          />
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
          <TypewriterSpeedControl
            typewriterSpeed={typewriterSpeed}
            onTypewriterSpeedChange={onTypewriterSpeedChange}
          />
          <HistoryButton
            onShowHistory={onShowHistory}
            onClose={onClose}
            onClearHistory={onClearHistory}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;