import { MoodAnalyzer, GeminiAPIError } from '@classes/MoodAnalyzer';
import { EmojiManager } from '@classes/EmojiManager';
import { StorageManager } from '@classes/StorageManager';
import { UIStateManager } from '@classes/UIStateManager';
import { ConversationEntry, GeminiMoodResponse } from '@types/types';
import { DEFAULT_SETTINGS } from '@constants/appConstants';

/**
 * Controleur principal de l'application
 */
export class ApplicationController {
  private moodAnalyzer: MoodAnalyzer;
  private emojiManager: EmojiManager;
  private storageManager: StorageManager;
  private uiStateManager: UIStateManager;

  private isInitialized: boolean = false;
  private currentLanguage: 'fr' | 'en' = DEFAULT_SETTINGS.LANGUAGE;
  private currentModel: string = DEFAULT_SETTINGS.MODEL;
  private readonly defaultModel: string = DEFAULT_SETTINGS.MODEL;

  constructor(geminiApiKey: string) {
    // Initialiser toutes les classes
    this.moodAnalyzer = new MoodAnalyzer(geminiApiKey);
    this.emojiManager = new EmojiManager();
    this.storageManager = new StorageManager('feel_conversations');
    this.uiStateManager = new UIStateManager();

    console.log('[ApplicationController] Initialized');
  }

  /**
   * Initialise l'application (charge les données persistées)
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('[ApplicationController] Already initialized');
      return;
    }

    console.log('[ApplicationController] Initializing...');

    try {
      // 1. Charger l'historique des conversations
      const savedConversations = this.storageManager.load();
      this.moodAnalyzer.setHistory(savedConversations);

      // 2. Charger l'emoji par défaut
      const defaultEmoji = await this.emojiManager.getDefaultEmoji();
      this.uiStateManager.updateUserEmoji(defaultEmoji);

      this.isInitialized = true;
      console.log('[ApplicationController] Initialization complete');

      // Log des stats
      const stats = this.getStatistics();
      console.log('[ApplicationController] Initial Stats:', stats);
    } catch (error) {
      console.error('[ApplicationController] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Traite un message utilisateur et retourne la réponse complète
   * C'est ici que les deux requAªtes dépendantes sont effectuées
   */
  public async processMessage(message: string): Promise<{
    response: GeminiMoodResponse;
    floatingEmojis: any[];
    conversationEntry: ConversationEntry;
  }> {
    if (!this.isInitialized) {
      throw new Error('Application not initialized. Call initialize() first.');
    }

    console.log(`[ApplicationController] Processing message: "${message.substring(0, 50)}..."`);

    try {
      // ============================================
      // REQUETE 1 : Analyse du message avec Gemini -----------------------------------
      // ============================================
      const geminiResponse = await this.moodAnalyzer.analyze(
        message,
        this.currentLanguage,
        this.currentModel
      );

      console.log(`[ApplicationController] Gemini analysis: mood=${geminiResponse.mood}, group=${geminiResponse.group}`);

      // ============================================
      // REQUETE 2 : Récupération des emojis
      // Cette requète dépends de la première car utilise geminiResponse.group ------------------
      // ============================================
      const emojisData = await this.emojiManager.getEmojisForMood(geminiResponse.group);
      const floatingEmojis = this.emojiManager.createFloatingEmojiData(emojisData, 7);

      console.log(`[ApplicationController] Retrieved ${emojisData.length} emojis for group "${geminiResponse.group}"`);

      // Mettre a jour l'état visuel
      this.uiStateManager.updateUserEmoji(geminiResponse.emoji, geminiResponse.animation);
      this.uiStateManager.updateFloatingEmojis(floatingEmojis);
      this.uiStateManager.updateBackgroundColors(geminiResponse.backgroundColors);

      // Ajouter a l'historique
      const conversationEntry = this.moodAnalyzer.addToHistory(message, geminiResponse);
      
      // Sauvegarder
      this.saveConversations();

      return {
        response: geminiResponse,
        floatingEmojis,
        conversationEntry
      };
    } catch (error) {
      console.error('[ApplicationController] Error processing message:', error);
      
      // Si c'est une GeminiAPIError, relancer avec le message utilisateur
      if (error instanceof Error && error.name === 'GeminiAPIError') {
        const apiError = error as any;
        // Créer une nouvelle erreur avec le message pour l'utilisateur
        const userError = new Error(apiError.userMessage || apiError.message);
        userError.name = 'GeminiAPIError';
        (userError as any).statusCode = apiError.statusCode;
        throw userError;
      }
      
      throw error;
    }
  }

  /**
   * Sauvegarde les conversations
   */
  private saveConversations(): void {
    const history = this.moodAnalyzer.getHistory();
    this.storageManager.save(history);
  }

  /**
   * Obtient l'historique des conversations
   */
  public getConversationHistory(): ConversationEntry[] {
    return this.moodAnalyzer.getHistory();
  }

  /**
   * Efface l'historique
   */
  public clearHistory(): void {
    this.moodAnalyzer.clearHistory();
    this.storageManager.clear();
    this.uiStateManager.reset();
    
    console.log('[ApplicationController] History cleared');
  }

  /**
   * Change la langue
   */
  public setLanguage(language: 'fr' | 'en'): void {
    this.currentLanguage = language;
    console.log(`[ApplicationController] Language set to: ${language}`);
  }

  /**
   * Change le modèle Gemini
   */
  public setModel(model: string): void {
    this.currentModel = model;
    console.log(`[ApplicationController] Model set to: ${model}`);
  }

  /**
   * Obtient le contexte actuel
   */
  public getCurrentContext(): string {
    return this.moodAnalyzer.getCurrentContext();
  }

  /**
   * Obtient l'état visuel actuel
   */
  public getUIState() {
    return this.uiStateManager.getState();
  }

  /**
   * Obtient des statistiques sur l'application
   */
  public getStatistics() {
    const storageStats = this.storageManager.getStats();
    const cacheStats = this.emojiManager.getCacheStats();
    const uiState = this.uiStateManager.getState();

    return {
      storage: storageStats,
      emojiCache: cacheStats,
      ui: {
        currentEmoji: uiState.userEmoji,
        currentAnimation: uiState.currentAnimation,
        activeLayer: uiState.activeLayer,
        floatingEmojisCount: uiState.floatingEmojis.length
      },
      settings: {
        language: this.currentLanguage,
        model: this.currentModel
      }
    };
  }

  /**
   * Exporte les données au format JSON
   */
  public exportData(): string {
    return this.storageManager.export();
  }

  /**
   * Importe des données depuis JSON
   */
  public importData(jsonData: string): boolean {
    const success = this.storageManager.import(jsonData);
    
    if (success) {
      // Recharger l'historique dans le MoodAnalyzer
      const conversations = this.storageManager.load();
      this.moodAnalyzer.setHistory(conversations);
    }
    
    return success;
  }

  /**
   * Nettoie les anciennes données
   */
  public cleanup(keepCount: number = 50): number {
    const removed = this.storageManager.cleanup(keepCount);
    
    // Recharger l'historique mis A jour
    const conversations = this.storageManager.load();
    this.moodAnalyzer.setHistory(conversations);
    
    return removed;
  }

  /**
   * Réinitialise complètement l'application
   */
  public reset(): void {
    this.clearHistory();
    this.emojiManager.clearCache();
    this.currentLanguage = 'fr';
    this.currentModel = this.defaultModel;
    
    console.log('[ApplicationController] Application reset');
  }

  /**
   * Libère les ressources
   */
  public dispose(): void {
    this.emojiManager.clearCache();
    
    console.log('[ApplicationController] Disposed');
  }
}