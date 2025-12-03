import { GeminiMoodResponse, ConversationEntry } from '@types/types';
import { DEFAULT_SETTINGS } from '@constants/appConstants';
/**
 * Erreur personnalisée pour les problèmes d'API Gemini
 */
export class GeminiAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'GeminiAPIError';
  }
}

/**
 * Classe responsable de l'analyse d'humeur via l'API Gemini
 * Gere le contexte conversationnel et l'historique
 */
export class MoodAnalyzer {
  private previousSummary: string = '';
  private readonly apiBaseUrl: string ='https://generativelanguage.googleapis.com/v1beta/models';
  private conversationHistory: ConversationEntry[] = [];
  private readonly apiKey: string;
  private readonly requiredColorCount: number = 4;

  constructor(apiKey: string, initialHistory: ConversationEntry[] = []) {
    this.apiKey = apiKey;
    this.conversationHistory = initialHistory;
    this.restoreContext();
  }

  /**
   * Analyse un message et retourne la réponse de Gemini
   */
  public async analyze(
    message: string,
    language: string = 'fr',
    model: string = DEFAULT_SETTINGS.MODEL
  ): Promise<GeminiMoodResponse> {
    const prompt = this.createPrompt(message, language);
    const response = await this.fetchGeminiResponse(prompt, model);
    
    // Valider la réponse
    this.validateResponse(response);
    
    // Mettre A jour le contexte
    this.previousSummary = response.contextSummary;
    
    return response;
  }

  /**
   * Ajoute une entrée A l'historique
   */
  public addToHistory(userMessage: string, geminiResponse: GeminiMoodResponse): ConversationEntry {
    const newEntry: ConversationEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userMessage,
      geminiResponse,
      contextSummary: geminiResponse.contextSummary
    };

    this.conversationHistory.unshift(newEntry);
    return newEntry;
  }

  /**
   * Récupère l'historique complet
   */
  public getHistory(): ConversationEntry[] {
    return [...this.conversationHistory];
  }

  /**
   * Efface l'historique et réinitialise le contexte
   */
  public clearHistory(): void {
    this.conversationHistory = [];
    this.previousSummary = '';
  }

  /**
   * Récupère le contexte actuel
   */
  public getCurrentContext(): string {
    return this.previousSummary;
  }

  /**
   * Définit l'historique
   */
  public setHistory(history: ConversationEntry[]): void {
    this.conversationHistory = history;
    this.restoreContext();
  }

  /**
   * Restaure le contexte depuis l'historique
   */
  private restoreContext(): void {
    if (this.conversationHistory.length > 0) {
      this.previousSummary = this.conversationHistory[0].contextSummary;
    }
  }

  /**
   * Crée le prompt pour Gemini
   */
  private createPrompt(text: string, language: string): string {
    const promptHeader = `Analyse cette phrase et retourne UNIQUEMENT un objet JSON valide avec cette structure exacte (sans markdown, sans texte supplémentaire):
{
  "mood": "un mot décrivant l'humeur (joyeux, triste, anxieux, calme, énergique, mélancolique, stressé, paisible, content, colère, amoureux, serein, etc.)",
  "intensity": un nombre entre 1 et 10,
  "emoji": "un emoji approprié qui représente le contextSummary le mieux possible en fonction de l'intensité",
  "group": un groupe qui permettrait d'exprimer au mieux le 'emoji' parmis ["face positive","face neutral","face negative","face role","face sick","creature face","cat face","monkey face","person","person role","person gesture","person activity","family","skin tone","body","emotion","clothing","animal mammal","animal bird","animal amphibian","animal reptile","animal marine","animal bug","plant flower","plant other","food fruit","food vegetable","food prepared","food asian","food sweet","drink","dishware","travel and places","activities","objects","symbols","flags"],
  "backgroundColors": ${this.requiredColorCount} couleurs sous la forme "#RRGGBB" ex: ["#RRGGBB", ...],
  "animation": "une animation parmi cette liste: rotation, zoom, shake, bounce, pulse, wiggle - choisis celle qui correspond le mieux au contexte",
  "supportMessage": "un message pour approfondir ce que la personne te dit, cherche a comprendre ce qu'elle ressent et pourquoi. Si elle te dit de faire quelque chose, fait le",
  "contextSummary": "une reformulation courte qui combine le contexte précédent avec la nouvelle information pour décrire la situation actuelle de l'utilisateur"
}`;

    const promptInstructions = `Instructions importantes:
- backgroundColors: renvoie exactement ${this.requiredColorCount} couleurs hexadécimales (format #RRGGBB) en rapport avec l'intensité, l'humeur (ex: content très joyeux -> verts vifs ou jaunes lumineux, calme paisible -> bleus doux et verts apaisants, colère intense -> rouges profonds et contrastés, voyage inspirant -> bleus océaniques et turquoises, amour -> roses et rouges chaleureux). Les couleurs doivent Aªtre harmonieuses, ordonnées du ton principal vers les accents et prAªtes A Aªtre utilisées dans un gradient. Elles doivent représenter l'objet du message A analyser, NE ME DONNE PAS DES COULEURS BLANCHES!.
1. Utilise le contexte cumulatif fourni pour comprendre ce qui s'est déjA passé.
2. Interprète la nouvelle phrase en fonction de ce contexte.
3. Mets A jour "contextSummary" en franA§ais pour qu'il décrive la situation complète après avoir ajouté la nouvelle information. Il doit rester court, clair et naturel.`;

    const formattedContext = this.formatContext(language);
    const lang = language === 'fr' ? 'franA§ais' : 'anglais';

    return [
      promptHeader,
      promptInstructions,
      formattedContext,
      `Phrase A analyser: "${text}"`,
      `Réponds moi en ${lang}, peu importe la langue que l'utilisateur utilise, c'est très important.`
    ].join('\n\n');
  }

  /**
   * Formate le contexte précédent pour le prompt
   */
  private formatContext(language: string): string {
    if (!this.previousSummary) {
      const noContextMessage = {
        fr: "Tu ne disposes pas encore de contexte. Construis-en un A partir de la nouvelle phrase.",
        en: "You don't have context yet. Build one from the new sentence."
      };
      return noContextMessage[language as keyof typeof noContextMessage];
    }

    const lang = language === 'fr' ? 'franA§ais' : 'anglais';
    return `Contexte cumulatif actuel (A mettre A jour en ${lang}) :\n${this.previousSummary}\n\n`;
  }

  /**
   * Effectue la requête vers l'API Gemini
   */
  private async fetchGeminiResponse(prompt: string, model: string): Promise<GeminiMoodResponse> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/${model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw this.handleAPIError(response.status, errorData);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new GeminiAPIError(
          "Gemini response missing content text",
          undefined,
          "L'API Gemini n'a pas retourné de contenu. Veuillez réessayer."
        );
      }

      return this.parseResponse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      if (error instanceof GeminiAPIError) {
        throw error;
      }
      
      // Gérer les erreurs réseau
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new GeminiAPIError(
          `Network error: ${error.message}`,
          undefined,
          "Erreur de connexion. Vérifiez votre connexion internet et réessayez."
        );
      }
      
      // Autres erreurs inattendues
      throw new GeminiAPIError(
        `Unexpected error: ${(error as Error).message}`,
        undefined,
        "Une erreur inattendue s'est produite. Veuillez réessayer."
      );
    }
  }

  /**
   * Gère les erreurs de l'API Gemini selon le code de statut HTTP
   */
  private handleAPIError(statusCode: number, errorData: any): GeminiAPIError {
    const errorMessage = errorData?.error?.message || 'Unknown error';
    
    switch (statusCode) {
      case 400:
        return new GeminiAPIError(
          `Bad Request: ${errorMessage}`,
          400,
          "Requête invalide. Le format du message n'est pas accepté par l'API."
        );
      
      case 401:
        return new GeminiAPIError(
          `Unauthorized: ${errorMessage}`,
          401,
          "Clé API invalide. Veuillez vérifier votre clé API Gemini dans les paramètres."
        );
      
      case 403:
        return new GeminiAPIError(
          `Forbidden: ${errorMessage}`,
          403,
          "Accès refusé. Votre clé API n'a pas les permissions nécessaires."
        );
      
      case 404:
        return new GeminiAPIError(
          `Not Found: ${errorMessage}`,
          404,
          "Modèle non trouvé. Vérifiez que le modèle sélectionné existe."
        );
      
      case 429:
        return new GeminiAPIError(
          `Rate Limit Exceeded: ${errorMessage}`,
          429,
          "Limite de requêtes atteinte. Veuillez patienter quelques instants avant de réessayer."
        );
      case 503:
        return new GeminiAPIError(
          `Server Error: ${errorMessage}`,
          statusCode,
          "Erreur serveur de l'API Gemini. Veuillez réessayer dans quelques instants."
        );
      
      default:
        return new GeminiAPIError(
          `HTTP Error ${statusCode}: ${errorMessage}`,
          statusCode,
          `Erreur API (${statusCode}). Veuillez réessayer.`
        );
    }
  }

  /**
   * Parse la réponse JSON de Gemini
   */
  private parseResponse(payload: string): GeminiMoodResponse {
    const jsonBlockPattern = /```json\n?|```\n?/g;
    const cleaned = payload.replace(jsonBlockPattern, '').trim();

    try {
      return JSON.parse(cleaned) as GeminiMoodResponse;
    } catch (error) {
      throw new GeminiAPIError(
        `Unable to parse Gemini response: ${(error as Error).message}`,
        undefined,
        "La réponse de l'API Gemini n'est pas au format attendu. Veuillez réessayer."
      );
    }
  }

  /**
   * Valide la réponse de Gemini
   */
  private validateResponse(response: GeminiMoodResponse): void {
    if (!Array.isArray(response.backgroundColors) || response.backgroundColors.length !== this.requiredColorCount) {
      throw new GeminiAPIError(
        `Invalid backgroundColors count. Expected ${this.requiredColorCount}, got ${response.backgroundColors?.length}`,
        undefined,
        `La réponse contient un nombre incorrect de couleurs (${response.backgroundColors?.length || 0} au lieu de ${this.requiredColorCount}). Veuillez réessayer.`
      );
    }

    if (!response.mood || !response.emoji || !response.group) {
      const missing = [];
      if (!response.mood) missing.push('mood');
      if (!response.emoji) missing.push('emoji');
      if (!response.group) missing.push('group');
      
      throw new GeminiAPIError(
        `Missing required fields in Gemini response: ${missing.join(', ')}`,
        undefined,
        "La réponse de l'API est incomplète. Veuillez réessayer."
      );
    }

    if (typeof response.intensity !== 'number' || response.intensity < 1 || response.intensity > 10) {
      throw new GeminiAPIError(
        `Invalid intensity value: ${response.intensity}. Must be between 1 and 10`,
        undefined,
        "L'intensité retournée par l'API est invalide. Veuillez réessayer."
      );
    }
  }
}