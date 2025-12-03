import { useState, useEffect, useCallback, useRef } from 'react';
import { ApplicationController } from '@classes';
import { GeminiMoodResponse, ConversationEntry, FloatingEmojiItem } from '@types/types';
import { DEFAULT_SETTINGS } from '@constants/appConstants';

// Configuration
const GEMINI_API_KEY  = process.env.GEMINI_API_KEY;

/**
 * Hook principal qui encapsule l'ApplicationController
 */
export const useApplicationController = () => {
  // Référence au contrA´leur (persiste entre les renders)
  const controllerRef = useRef<ApplicationController | null>(null);

  // Etats pour l'UI
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Etats de l'application
  const [response, setResponse] = useState<string | null>(null);
  const [userEmoji, setUserEmoji] = useState('ðŸ™‚');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmojiItem[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState('none');
  const [backgroundColors, setBackgroundColors] = useState<string[]>(['#667eea', '#764ba2']);
  const [prevBackgroundColors, setPrevBackgroundColors] = useState<string[]>(['#667eea', '#764ba2', '#f093fb']);
  const [activeLayer, setActiveLayer] = useState<'prev' | 'current'>('current');
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  // Paramètres
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_SETTINGS.MODEL);
  const [typewriterSpeed, setTypewriterSpeed] = useState(25);

  /**
   * Initialisation du contrA´leur
   */
  useEffect(() => {
    const initController = async () => {
      try {
        console.log('[useApplicationController] Initializing controller...');
        
        // Créer l'instance du contrA´leur
        const controller = new ApplicationController(GEMINI_API_KEY);
        controllerRef.current = controller;

        // Initialiser l'application
        await controller.initialize();

        // Charger l'état initial
        const history = controller.getConversationHistory();
        const uiState = controller.getUIState();

        setConversationHistory(history);
        setUserEmoji(uiState.userEmoji);
        setBackgroundColors(uiState.backgroundColors);
        setPrevBackgroundColors(uiState.prevBackgroundColors);
        setActiveLayer(uiState.activeLayer);
        
        setIsInitialized(true);
        console.log('[useApplicationController] Controller initialized successfully');
      } catch (err) {
        console.error('[useApplicationController] Initialization failed:', err);
        setError('Failed to initialize application');
      }
    };

    initController();

    // Cleanup
    return () => {
      if (controllerRef.current) {
        controllerRef.current.dispose();
      }
    };
  }, []);

  /**
   * Synchroniser les paramètres avec le contrA´leur
   */
  useEffect(() => {
    if (controllerRef.current && isInitialized) {
      controllerRef.current.setLanguage(language);
    }
  }, [language, isInitialized]);

  useEffect(() => {
    if (controllerRef.current && isInitialized) {
      controllerRef.current.setModel(selectedModel);
    }
  }, [selectedModel, isInitialized]);

  /**
   * Soumet un message et met A jour l'UI
   */
  const handleSubmit = useCallback(async (message: string) => {
    if (!controllerRef.current || !isInitialized) {
      console.error('[useApplicationController] Controller not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Utiliser le contrA´leur pour traiter le message
      const result = await controllerRef.current.processMessage(message);

      // Mettre A jour l'état React
      setResponse(result.response.supportMessage);
      
      // Obtenir l'état UI mis A jour
      const uiState = controllerRef.current.getUIState();
      setUserEmoji(uiState.userEmoji);
      setFloatingEmojis(result.floatingEmojis);
      setCurrentAnimation(result.response.animation);
      setBackgroundColors(uiState.backgroundColors);
      setPrevBackgroundColors(uiState.prevBackgroundColors);
      setActiveLayer(uiState.activeLayer);

      // Reset animation after 2 seconds
      setTimeout(() => setCurrentAnimation('none'), 2100);

      // Mettre A jour l'historique
      const updatedHistory = controllerRef.current.getConversationHistory();
      setConversationHistory(updatedHistory);

    } catch (err) {
      console.error('[useApplicationController] Error processing message:', err);
      
      // Utiliser le message d'erreur spécifique si disponible
      let errorMessage: string;
      
      if (err instanceof Error) {
        // Si c'est une GeminiAPIError avec un message convivial, l'utiliser
        errorMessage = err.message;
      } else {
        // Message par défaut selon la langue
        errorMessage = language === 'fr' 
          ? 'Impossible de récupérer une réponse pour le moment.'
          : 'Unable to retrieve a response at the moment.';
      }
      
      setError(errorMessage);
      setResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, language]);

  /**
   * Efface l'historique
   */
  const handleClearHistory = useCallback(() => {
    if (!controllerRef.current) return;

    controllerRef.current.clearHistory();
    
    // Réinitialiser l'état
    setConversationHistory([]);
    setResponse(null);
    
    const uiState = controllerRef.current.getUIState();
    setUserEmoji(uiState.userEmoji);
    setFloatingEmojis([]);
    setBackgroundColors(uiState.backgroundColors);
    setPrevBackgroundColors(uiState.prevBackgroundColors);
    setActiveLayer(uiState.activeLayer);
    setCurrentAnimation('none');
  }, []);

  /**
   * Obtient les statistiques
   */
  const getStats = useCallback(() => {
    if (!controllerRef.current) return null;
    return controllerRef.current.getStatistics();
  }, []);

  /**
   * Exporte les données
   */
  const exportData = useCallback(() => {
    if (!controllerRef.current) return '';
    return controllerRef.current.exportData();
  }, []);

  /**
   * Importe des données
   */
  const importData = useCallback((jsonData: string) => {
    if (!controllerRef.current) return false;
    
    const success = controllerRef.current.importData(jsonData);
    
    if (success) {
      // Recharger l'historique
      const history = controllerRef.current.getConversationHistory();
      setConversationHistory(history);
    }
    
    return success;
  }, []);

  return {
    // Etats
    isInitialized,
    isLoading,
    error,
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
    getStats,
    exportData,
    importData,

    controller: controllerRef.current
  };
};