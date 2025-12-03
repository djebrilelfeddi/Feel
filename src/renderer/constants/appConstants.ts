export const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', description: "Modèle léger pour des réponses rapides et efficaces." },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: "Modèle standard offrant un bon équilibre entre vitesse et qualité." },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (expérimental)', description: "Modèle expérimental avec les dernières améliorations." },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: "Modèle avancé pour des performances optimales et une compréhension approfondie." },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: "Modèle rapide avec des capacités améliorées par rapport à la version 2.0." },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: "Version allégée du Gemini 2.5 pour des tâches rapides." }
];

export const DEFAULT_SETTINGS = {
  LANGUAGE: 'fr' as const,
  TYPEWRITER_SPEED: 25,
  MODEL: AVAILABLE_MODELS[0].id,
  EMOJI: '🙂'
};

export const ANIMATION_TIMINGS = {
  ANIMATION_DELAY: 50,
  ANIMATION_DURATION: 2100, // 2.1 secondes
  BACKGROUND_TRANSITION_DELAY: 50
};

export const STORAGE_KEYS = {
  CONVERSATIONS: 'feel_conversations'
};
