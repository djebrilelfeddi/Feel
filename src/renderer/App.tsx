import React, { useState } from "react";
import { translations } from "@utils/translations";
import { useApplicationController } from "@hooks/useApplicationController";
import MainInterface from "@components/MainInterface";
import '@styles/emoji-animations.css';


/**
 * Composant principal de l'application
 */
const App = () => {
  // Utiliser le hook qui encapsule l'ApplicationController
  const {
    // Etats principaux
    isInitialized,
    isLoading,
    response,
    userEmoji,
    floatingEmojis,
    currentAnimation,
    backgroundColors,
    prevBackgroundColors,
    activeLayer,
    conversationHistory,

    // Paramètres
    language,
    setLanguage,
    selectedModel,
    setSelectedModel,
    typewriterSpeed,
    setTypewriterSpeed,

    // Actions
    handleSubmit,
    handleClearHistory,
  } = useApplicationController();

  // Etats locaux pour l'UI
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hasOpenedSettings, setHasOpenedSettings] = useState(false);

  const lang = translations[language];

  // Handlers
  const handleSettingsClick = () => {
    setShowSettings(true);
    setHasOpenedSettings(true);
  };

  const handleClearHistoryWithReset = () => {
    handleClearHistory();
    // Fermer la popup d'historique si ouverte
    setShowHistory(false);
  };

  // Afficher un loader pendant l'initialisation
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="glass-effect rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-lg">Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <MainInterface
      // Etats principaux
      response={response}
      isLoading={isLoading}
      floatingEmojis={floatingEmojis}
      userEmoji={userEmoji}
      backgroundColors={backgroundColors}
      prevBackgroundColors={prevBackgroundColors}
      activeLayer={activeLayer}
      currentAnimation={currentAnimation}
      typewriterSpeed={typewriterSpeed}

      // Etats des paramètres
      language={language}
      showSettings={showSettings}
      selectedModel={selectedModel}
      hasOpenedSettings={hasOpenedSettings}

      // Etats de l'historique
      showHistory={showHistory}
      conversationHistory={conversationHistory}

      // Handlers
      onSettingsClick={handleSettingsClick}
      onSubmit={handleSubmit}
      onSettingsClose={() => setShowSettings(false)}
      onLanguageChange={setLanguage}
      onTypewriterSpeedChange={setTypewriterSpeed}
      onModelChange={setSelectedModel}
      onShowHistory={() => setShowHistory(true)}
      onClearHistory={handleClearHistoryWithReset}
      onHistoryClose={() => setShowHistory(false)}
    />
  );
};

export default App;
