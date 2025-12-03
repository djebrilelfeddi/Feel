import { EmojiApiItem, FloatingEmojiItem } from '@types/types';

/**
 * Classe responsable de la gestion des emojis
 * Inclut un système de cache pour optimiser les requêtes 
 */
export class EmojiManager {
  private cache: Map<string, EmojiApiItem[]> = new Map();
  private readonly apiBaseUrl: string = 'https://emojihub.yurace.pro/api';
  private readonly cacheDuration: number = 3600000; // 1 heure
  private cacheTimestamps: Map<string, number> = new Map();

  /**
   * Récupère les emojis pour un groupe donné (avec cache)
   */
  public async getEmojisForMood(group: string): Promise<EmojiApiItem[]> {
    // Vérifier si le cache est valide
    if (this.isCacheValid(group)) {
      console.log(`[EmojiManager] Cache hit for group: ${group}`);
      return this.cache.get(group)!;
    }

    console.log(`[EmojiManager] Fetching emojis for group: ${group}`);
    const emojis = await this.fetchEmojisFromApi(group);
    
    // Mettre en cache pr que ce sois plus rapide la prochaine fois
    this.cache.set(group, emojis);
    this.cacheTimestamps.set(group, Date.now());
    
    return emojis;
  }

  /**
   * Récupère un emoji aléatoire
   */
  public async getRandomEmoji(): Promise<EmojiApiItem> {
    const response = await fetch(`${this.apiBaseUrl}/random`);

    if (!response.ok) {
      throw new Error(`EmojiHub request failed (${response.status})`);
    }

    return response.json();
  }

  /**
   * Crée des données pour les emojis flottants à partir d'une liste d'emojis
   */
  public createFloatingEmojiData(
    emojis: EmojiApiItem[],
    maxCount: number = 7
  ): FloatingEmojiItem[] {
    try {
      return emojis.slice(0, maxCount).map((item, idx) => {
        const emoji = this.convertHtmlToEmoji(item.htmlCode);
        return {
          id: `${emoji}-${idx}-${Date.now()}`,
          emoji,
          left: Math.random() * 80 + 10,
          size: Math.random() * 1.5 + 1.5,
          duration: Math.random() * 8 + 4,
          delay: Math.random() * 4,
        };
      });
    } catch (error) {
      console.error('[EmojiManager] Error creating floating emoji data:', error);
      return [];
    }
  }

  /**
   * Convertit le code HTML en emoji
   */
  public convertHtmlToEmoji(htmlCode?: string | string[]): string {
    if (!htmlCode) {
      return '😊';
    }

    const codes = Array.isArray(htmlCode) ? htmlCode : [htmlCode];

    return codes
      .map((code) => {
        const match = /&#(\d+);/.exec(code);
        if (match) {
          return String.fromCodePoint(Number(match[1]));
        }
        return code;
      })
      .join('');
  }

  /**
   * Récupère un emoji initial par défaut (visage positif aléatoire)
   */
  public async getDefaultEmoji(): Promise<string> {
    try {
      const emojis = await this.getEmojisForMood('face positive');
      if (emojis.length === 0) {
        return '🙂';
      }
      const randomIndex = Math.floor(Math.random() * emojis.length);
      return this.convertHtmlToEmoji(emojis[randomIndex].htmlCode);
    } catch (error) {
      console.error('[EmojiManager] Error fetching default emoji:', error);
      return '🙂';
    }
  }

  /**
   * Vide le cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
    console.log('[EmojiManager] Cache cleared');
  }

  /**
   * Obtient des statistiques sur le cache
   */
  public getCacheStats(): { size: number; groups: string[] } {
    return {
      size: this.cache.size,
      groups: Array.from(this.cache.keys())
    };
  }

  /**
   * Vérifie si le cache pour un groupe est encore valide
   */
  private isCacheValid(group: string): boolean {
    if (!this.cache.has(group)) {
      return false;
    }

    const timestamp = this.cacheTimestamps.get(group);
    if (!timestamp) {
      return false;
    }

    const age = Date.now() - timestamp;
    return age < this.cacheDuration;
  }

  /**
   * Effectue la requête API pour récupérer les emojis
   */
  private async fetchEmojisFromApi(group: string): Promise<EmojiApiItem[]> {
    const response = await fetch(
      `${this.apiBaseUrl}/all/group/${encodeURIComponent(group)}`
    );

    if (!response.ok) {
      throw new Error(`EmojiHub request failed (${response.status})`);
    }

    const payload: EmojiApiItem[] = await response.json();
    return payload;
  }
}
