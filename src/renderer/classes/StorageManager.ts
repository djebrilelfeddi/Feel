import { ConversationEntry } from '@types/types';
import { STORAGE_KEYS } from '@constants/appConstants';

/**
 * Classe responsable de la persistance des données dans le localStorage
 * Gère la sauvegarde, le chargement et la suppression des conversations
 */
export class StorageManager {
  private readonly storageKey: string;
  private compressionEnabled: boolean = true;

  constructor(storageKey: string = STORAGE_KEYS.CONVERSATIONS) {
    this.storageKey = storageKey;
  }

  /**
   * Sauvegarde les conversations dans le localStorage
   */
  public save(conversations: ConversationEntry[]): boolean {
    try {
      const data = this.compressionEnabled 
        ? this.compress(conversations) 
        : JSON.stringify(conversations);
      
      localStorage.setItem(this.storageKey, data);
      console.log(`[StorageManager] Saved ${conversations.length} conversations`);
      return true;
    } catch (error) {
      console.error('[StorageManager] Error saving conversations:', error);
      
      // Si l'erreur est due à un quota dépassé, essayer de nettoyer
      if (this.isQuotaExceededError(error)) {
        console.warn('[StorageManager] Storage quota exceeded, attempting cleanup...');
        this.cleanup();
        
        // Réessayer après nettoyage
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(conversations));
          return true;
        } catch (retryError) {
          console.error('[StorageManager] Failed to save even after cleanup:', retryError);
        }
      }
      
      return false;
    }
  }

  /**
   * Charge les conversations depuis le localStorage
   */
  public load(): ConversationEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      
      if (!stored) {
        console.log('[StorageManager] No stored conversations found');
        return [];
      }

      const parsed = this.compressionEnabled 
        ? this.decompress(stored) 
        : JSON.parse(stored);
      
      // Convertir les timestamps string en Date objects
      const conversations = parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));

      console.log(`[StorageManager] Loaded ${conversations.length} conversations`);
      return conversations;
    } catch (error) {
      console.error('[StorageManager] Error loading conversations:', error);
      return [];
    }
  }

  /**
   * Supprime toutes les conversations
   */
  public clear(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('[StorageManager] Conversations cleared');
      return true;
    } catch (error) {
      console.error('[StorageManager] Error clearing conversations:', error);
      return false;
    }
  }

  /**
   * Récupère le dernier contexte de conversation
   */
  public getLastContext(conversations: ConversationEntry[]): string {
    if (conversations.length === 0) {
      return '';
    }
    return conversations[0].contextSummary; // Le premier car l'historique est inversé
  }

  /**
   * Exporte les conversations au format JSON
   */
  public export(): string {
    const conversations = this.load();
    return JSON.stringify(conversations, null, 2);
  }

  /**
   * Importe des conversations depuis un JSON
   */
  public import(jsonData: string): boolean {
    try {
      const conversations = JSON.parse(jsonData);
      
      // Valider le format
      if (!Array.isArray(conversations)) {
        throw new Error('Invalid format: expected an array');
      }

      // Valider chaque entrée
      conversations.forEach((entry, index) => {
        if (!entry.id || !entry.timestamp || !entry.userMessage || !entry.geminiResponse) {
          throw new Error(`Invalid entry at index ${index}`);
        }
      });

      return this.save(conversations);
    } catch (error) {
      console.error('[StorageManager] Error importing conversations:', error);
      return false;
    }
  }

  /**
   * Obtient la taille utilisée dans le localStorage
   */
  public getStorageSize(): number {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return 0;
      
      // Taille en bytes (approximatif, chaque caractère = 2 bytes en UTF-16)
      return stored.length * 2;
    } catch (error) {
      console.error('[StorageManager] Error getting storage size:', error);
      return 0;
    }
  }

  /**
   * Obtient des statistiques sur le stockage
   */
  public getStats(): {
    count: number;
    size: number;
    sizeFormatted: string;
    oldestEntry: Date | null;
    newestEntry: Date | null;
  } {
    const conversations = this.load();
    const size = this.getStorageSize();

    return {
      count: conversations.length,
      size,
      sizeFormatted: this.formatBytes(size),
      oldestEntry: conversations.length > 0 
        ? new Date(conversations[conversations.length - 1].timestamp) 
        : null,
      newestEntry: conversations.length > 0 
        ? new Date(conversations[0].timestamp) 
        : null
    };
  }

  /**
   * Active ou désactive la compression
   */
  public setCompression(enabled: boolean): void {
    this.compressionEnabled = enabled;
    console.log(`[StorageManager] Compression ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Nettoie les anciennes conversations (garde seulement les N plus récentes)
   */
  public cleanup(keepCount: number = 50): number {
    try {
      const conversations = this.load();
      
      if (conversations.length <= keepCount) {
        console.log('[StorageManager] No cleanup needed');
        return 0;
      }

      const kept = conversations.slice(0, keepCount);
      const removed = conversations.length - kept.length;
      
      this.save(kept);
      console.log(`[StorageManager] Cleaned up ${removed} old conversations`);
      
      return removed;
    } catch (error) {
      console.error('[StorageManager] Error during cleanup:', error);
      return 0;
    }
  }

  /**
   * Vérifie si une erreur est due à un quota dépassé
   */
  private isQuotaExceededError(error: any): boolean {
    return (
      error instanceof DOMException &&
      (error.code === 22 ||
        error.code === 1014 ||
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    );
  }

  /**
   * Compresse les données (b64)
   */
  private compress(data: any): string {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  }

  /**
   * Décompresse les données
   */
  private decompress(data: string): any {
    const json = decodeURIComponent(atob(data));
    return JSON.parse(json);
  }

  /**
   * Formate les bytes en format lisible
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
