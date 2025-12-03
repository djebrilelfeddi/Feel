import { FloatingEmojiItem } from '@types/types';
import { DEFAULT_SETTINGS } from '@constants/appConstants';

/**
 * Classe responsable de la gestion des états visuels de l'application
 * Gère les couleurs, animations, et transitions d'interface
 */
export class UIStateManager {
  private backgroundColors: string[] = [];
  private prevBackgroundColors: string[] = [];
  private activeLayer: 'prev' | 'current' = 'current';
  private currentAnimation: string = 'none';
  private floatingEmojis: FloatingEmojiItem[] = [];
  private userEmoji: string = DEFAULT_SETTINGS.EMOJI;

  // Palettes de couleurs par défaut
  private readonly colorPalettes = [
    ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140', '#a8edea', '#fed6e3'],
    ['#ff9a9e', '#fecfef', '#a8e6cf', '#dcedc8'],
    ['#a8edea', '#fed6e3', '#d299c2', '#fef9d7'],
    ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef'],
  ];

  constructor() {
    this.initializeColors();
  }

  /**
   * Initialise les couleurs de fond avec une palette aléatoire
   */
  private initializeColors(): void {
    const palette = this.getRandomPalette();
    this.backgroundColors = palette.slice(0, 2);
    this.prevBackgroundColors = palette.slice(0, 3);
  }

  /**
   * Met à jour les couleurs de fond avec transition
   */
  public updateBackgroundColors(newColors: string[]): void {
    if (this.activeLayer === 'current') {
      this.prevBackgroundColors = newColors;
      this.activeLayer = 'prev';
    } else {
      this.backgroundColors = newColors;
      this.activeLayer = 'current';
    }
  }


  /**
   * Met à jour l'emoji principal avec animation
   */
  public updateUserEmoji(emoji: string, animation?: string): void {
    this.userEmoji = emoji;
    this.currentAnimation = animation || 'none';
  }

  /**
   * Met à jour les emojis flottants
   */
  public updateFloatingEmojis(emojis: FloatingEmojiItem[]): void {
    this.floatingEmojis = emojis;
  }

  /**
   * Réinitialise l'état visuel
   */
  public reset(): void {
    this.initializeColors();
    this.activeLayer = 'current';
    this.currentAnimation = 'none';
    this.floatingEmojis = [];
    this.userEmoji = '🙂';
  }

  /**
   * Obtient l'état actuel
   */
  public getState() {
    return {
      backgroundColors: [...this.backgroundColors],
      prevBackgroundColors: [...this.prevBackgroundColors],
      activeLayer: this.activeLayer,
      currentAnimation: this.currentAnimation,
      floatingEmojis: [...this.floatingEmojis],
      userEmoji: this.userEmoji
    };
  }

  /**
   * Obtient une palette aléatoire
   */
  private getRandomPalette(): string[] {
    const randomIndex = Math.floor(Math.random() * this.colorPalettes.length);
    return [...this.colorPalettes[randomIndex]];
  }
}
