import React from "react";
import { MoodEmoji, ResponseArea, FloatingEmojis, BackgroundGradient, ConversationHistory, SettingsPopup } from "@ui";
import { UserInputArea } from "@input";
import { SettingsButton } from "@buttons";
import { translations } from "../../utils/translations";

interface MainInterfaceProps {
  // Etats principaux
  response: string | null;
  isLoading: boolean;
  floatingEmojis: any[];
  userEmoji: string;
  backgroundColors: string[];
  prevBackgroundColors: string[];
  activeLayer: 'prev' | 'current';
  currentAnimation: string;
  typewriterSpeed: number;

  // Etats des paramètres
  language: 'fr' | 'en';
  showSettings: boolean;
  selectedModel: string;
  hasOpenedSettings: boolean;

  // Etats de l'historique
  showHistory: boolean;
  conversationHistory: any[];

  // Handlers
  onSettingsClick: () => void;
  onSubmit: (value: string) => void | Promise<void>;
  onSettingsClose: () => void;
  onLanguageChange: (lang: 'fr' | 'en') => void;
  onTypewriterSpeedChange: (speed: number) => void;
  onModelChange: (model: string) => void;
  onShowHistory: () => void;
  onClearHistory: () => void;
  onHistoryClose: () => void;
}

const MainInterface: React.FC<MainInterfaceProps> = ({
  response,
  isLoading,
  floatingEmojis,
  userEmoji,
  backgroundColors,
  prevBackgroundColors,
  activeLayer,
  currentAnimation,
  typewriterSpeed,
  language,
  showSettings,
  selectedModel,
  hasOpenedSettings,
  showHistory,
  conversationHistory,
  onSettingsClick,
  onSubmit,
  onSettingsClose,
  onLanguageChange,
  onTypewriterSpeedChange,
  onModelChange,
  onShowHistory,
  onClearHistory,
  onHistoryClose
}) => {
  const lang = translations[language];

  return (
    <div className="layout-centered layout-centered animate-fadeInUp">
      <BackgroundGradient
        backgroundColors={backgroundColors}
        prevBackgroundColors={prevBackgroundColors}
        activeLayer={activeLayer}
      />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingEmojis emojis={floatingEmojis} />
      </div>

      <div className="relative z-10 w-full gap-8 flex flex-col items-center px-4">
        <MoodEmoji content={isLoading ? lang.loading : userEmoji} animation={currentAnimation} />

        {response && (
          <ResponseArea message={response} typewriterSpeed={typewriterSpeed} />
        )}

        <div className="w-full max-w-2xl">
          <UserInputArea placeholder={lang.placeholder} onSubmit={onSubmit} />
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20">
        <SettingsButton onClick={onSettingsClick} hasOpenedSettings={hasOpenedSettings} />
      </div>

      <SettingsPopup
        isOpen={showSettings}
        onClose={onSettingsClose}
        language={language}
        onLanguageChange={onLanguageChange}
        typewriterSpeed={typewriterSpeed}
        onTypewriterSpeedChange={onTypewriterSpeedChange}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        onShowHistory={onShowHistory}
        onClearHistory={onClearHistory}
      />

      <ConversationHistory
        isOpen={showHistory}
        onClose={onHistoryClose}
        history={conversationHistory}
      />
    </div>
  );
};

export default MainInterface;