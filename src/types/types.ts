export interface EmojiApiItem {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string;
  emoji: string;
}

export interface GeminiMoodResponse {
  mood: string;
  intensity: number;
  emoji: string;
  group: string;
  backgroundColors: string[];
  supportMessage: string;
  contextSummary: string;
  animation: "rotation" | "zoom" | "shake" | "bounce" | "pulse" | "wiggle" | "none";
}

export type FloatingEmojiItem = {
  id: string;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

export interface ConversationEntry {
  id: string;
  timestamp: Date;
  userMessage: string;
  geminiResponse: GeminiMoodResponse;
  contextSummary: string;
}
