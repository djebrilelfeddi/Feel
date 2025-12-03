# Feel - Application d'Analyse d'Humeur IA

Feel est une application desktop basée sur Electron qui analyse les messages des utilisateurs pour déterminer leur état émotionnel en utilisant l'API Google Gemini AI. Elle fournit un retour visuel à travers des arrière-plans dynamiques, des emojis flottants et des réponses stylisées.

## Fonctionnalités

- **Analyse d'Humeur** : Utilise Gemini AI pour analyser l'entrée utilisateur et déterminer l'état émotionnel
- **Interface Utilisateur Dynamique** : Arrière-plans en dégradé et animations qui s'adaptent à l'humeur analysée
- **Historique des Conversations** : Stockage persistant des conversations avec localStorage
- **Support Multi-langue** : Traductions français et anglais
- **Panneau de Paramètres** : Langue configurable, modèle et vitesse de réponse
- **Multi-plateforme** : Construit avec Electron pour Windows, macOS et Linux

## Architecture

L'application suit une architecture modulaire avec séparation des préoccupations :

### Processus Principal (src/main/index.ts)
- Processus principal Electron gérant la création de fenêtres et l'intégration système
- Script de préchargement pour l'exposition sécurisée des API (src/main/preload.ts)

### Processus de Rendu
- **Interface Utilisateur basée sur React** (src/renderer/App.tsx)
- **Classes Core** (src/renderer/classes/index.ts) :
  - [`ApplicationController`](src/renderer/classes/ApplicationController.ts) : Orchestrateur principal
  - [`MoodAnalyzer`](src/renderer/classes/MoodAnalyzer.ts) : Intégration API Gemini
  - [`EmojiManager`](src/renderer/classes/EmojiManager.ts) : Récupération et mise en cache des emojis
  - [`StorageManager`](src/renderer/classes/StorageManager.ts) : Persistance des données
  - [`UIStateManager`](src/renderer/classes/UIStateManager.ts) : Gestion de l'état visuel
- **Composants UI** (src/renderer/components/ui/index.ts)
- **Services** (src/services/index.ts) : Clients API
- **Utilitaires** (src/utils/) : Helpers et traductions

### Flux de Données Clé

1. L'utilisateur saisit un message dans [`UserInputArea`](src/renderer/components/ui/input/UserInputArea.tsx)
2. [`ApplicationController.processMessage()`](src/renderer/classes/ApplicationController.ts) coordonne l'analyse
3. [`MoodAnalyzer.analyze()`](src/renderer/classes/MoodAnalyzer.ts) appelle l'API Gemini
4. [`EmojiManager`](src/renderer/classes/EmojiManager.ts) récupère les emojis pertinents
5. [`UIStateManager`](src/renderer/classes/UIStateManager.ts) met à jour les éléments visuels
6. Réponse affichée via [`ResponseArea`](src/renderer/components/ui/display/ResponseArea.tsx)

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Clé API Google Gemini

### Configuration

1. Clonez le dépôt :
```bash
git clone <url-du-dépôt>
cd feel
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez le fichier d'environnement :
```bash
cp .env.development .env.local
```

4. Ajoutez votre clé API Gemini dans `.env.local` :
```
GEMINI_API_KEY=votre_clé_api_ici
```

5. Démarrez le développement :
```bash
npm start
```

### Construction

```bash
npm run make
```

## Configuration

### Variables d'Environnement

- [`GEMINI_API_KEY`](src/main/preload.ts) : Clé API requise pour Google Gemini

### Configuration de Construction

- Configurations Webpack dans [`config/webpack`](config/webpack)
- Configuration Electron Forge : [`config/forge.config.js`](config/forge.config.js)
- Configuration Babel pour la compatibilité navigateur

## Référence API

### ApplicationController

Contrôleur d'application principal coordonnant tous les sous-systèmes.

```typescript
export class ApplicationController {
  async initialize(): Promise<void>
  async processMessage(message: string): Promise<{response: GeminiMoodResponse, floatingEmojis: any[], conversationEntry: ConversationEntry}>
  setLanguage(language: 'fr' | 'en'): void
  setModel(model: string): void
  exportData(): string
  importData(jsonData: string): boolean
  getStatistics(): object
}
```

### MoodAnalyzer

Gère la communication API Gemini et l'analyse d'humeur.

```typescript
export class MoodAnalyzer {
  async analyze(message: string, language: string, model: string): Promise<GeminiMoodResponse>
  addToHistory(userMessage: string, geminiResponse: GeminiMoodResponse): ConversationEntry
  getHistory(): ConversationEntry[]
  clearHistory(): void
}
```

### EmojiManager

Gère la récupération et la mise en cache des emojis.

```typescript
export class EmojiManager {
  async getEmojisForMood(group: string): Promise<EmojiApiItem[]>
  createFloatingEmojiData(emojis: EmojiApiItem[], maxCount: number): FloatingEmojiItem[]
  async getDefaultEmoji(): Promise<string>
  clearCache(): void
}
```

### StorageManager

Gère la persistance des données avec compression.

```typescript
export class StorageManager {
  save(conversations: ConversationEntry[]): boolean
  load(): ConversationEntry[]
  clear(): boolean
  export(): string
  import(jsonData: string): boolean
  cleanup(keepCount: number): number
}
```

### UIStateManager

Gère les états visuels et les animations.

```typescript
export class UIStateManager {
  updateBackgroundColors(newColors: string[]): void
  updateUserEmoji(emoji: string, animation?: string): void
  updateFloatingEmojis(emojis: FloatingEmojiItem[]): void
  getState(): object
}
```

## Composants

### Composants Principaux

- [`MainInterface`](src/renderer/components/MainInterface.tsx) : Composant de mise en page racine
- [`App`](src/renderer/App.tsx) : Point d'entrée de l'application

### Composants UI

- **Affichage** : [`ResponseArea`](src/renderer/components/ui/display/ResponseArea.tsx), [`BackgroundGradient`](src/renderer/components/ui/display/BackgroundGradient.tsx)
- **Saisie** : [`UserInputArea`](src/renderer/components/ui/input/UserInputArea.tsx), [`CharacterCounter`](src/renderer/components/ui/input/CharacterCounter.tsx)
- **Boutons** : [`SubmitButton`](src/renderer/components/ui/buttons/SubmitButton.tsx), [`SettingsButton`](src/renderer/components/ui/buttons/SettingsButton.tsx)
- **Paramètres** : [`LanguageSelector`](src/renderer/components/ui/settings/LanguageSelector.tsx), [`ModelSelector`](src/renderer/components/ui/settings/ModelSelector.tsx), [`TypewriterSpeedControl`](src/renderer/components/ui/settings/TypewriterSpeedControl.tsx)
- **Popups** : [`SettingsPopup`](src/renderer/components/ui/popups/SettingsPopup.tsx), [`ConfirmationPopup`](src/renderer/components/ui/popups/ConfirmationPopup.tsx)
- **Historique** : [`ConversationHistory`](src/renderer/components/ui/history/ConversationHistory.tsx)

### Hooks

- [`useApplicationController`](src/renderer/hooks/useApplicationController.ts) : Hook principal d'application

## Développement

### Structure du Projet

```
src/
├── main/                 # Processus principal Electron
├── renderer/             # Processus de rendu React
│   ├── classes/          # Logique métier core
│   ├── components/       # Composants React
│   ├── hooks/            # Hooks React personnalisés
│   ├── styles/           # CSS et styles
│   └── utils/            # Utilitaires et helpers
├── services/             # Clients API externes
├── types/                # Définitions TypeScript
└── utils/                # Utilitaires partagés
```

### Scripts

- `npm start` : Démarrer le développement avec rechargement à chaud
- `npm run start:web` : Démarrer la version web pour les tests
- `npm run package` : Créer un package distribuable
- `npm run make` : Construire les installateurs spécifiques à la plateforme
- `npm run lint` : Exécuter ESLint
- `npm run format` : Formater le code avec Prettier

### Technologies

- **Frontend** : React 18, TypeScript, Tailwind CSS
- **Backend** : Electron, Node.js
- **Construction** : Webpack, Babel, Electron Forge
- **APIs** : Google Gemini AI, EmojiHub API
- **Stockage** : localStorage avec compression

### Compatibilité Navigateur

Configuré pour les 3 dernières versions de navigateurs via preset-env Babel.