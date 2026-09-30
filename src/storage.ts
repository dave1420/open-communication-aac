import {
  DEFAULT_PREFERENCES,
  normalizeCustomPhraseLabel,
  type CustomPhrase,
  type Preferences,
} from "./model";

const PREFERENCES_KEY = "open-aac-preferences-v1";
const CUSTOM_PHRASES_KEY = "open-aac-custom-phrases-v1";

export function loadPreferences(): Preferences {
  try {
    const value = localStorage.getItem(PREFERENCES_KEY);
    if (!value) return DEFAULT_PREFERENCES;
    const candidate = JSON.parse(value) as Partial<Preferences>;
    return {
      columns: [2, 3, 4].includes(candidate.columns ?? -1)
        ? (candidate.columns as Preferences["columns"])
        : DEFAULT_PREFERENCES.columns,
      targetSize: [72, 88, 104].includes(candidate.targetSize ?? -1)
        ? (candidate.targetSize as Preferences["targetSize"])
        : DEFAULT_PREFERENCES.targetSize,
      lockoutMs: [0, 300, 600, 900].includes(candidate.lockoutMs ?? -1)
        ? (candidate.lockoutMs as Preferences["lockoutMs"])
        : DEFAULT_PREFERENCES.lockoutMs,
      speakOnSelect:
        candidate.speakOnSelect ?? DEFAULT_PREFERENCES.speakOnSelect,
      voiceURI:
        typeof candidate.voiceURI === "string"
          ? candidate.voiceURI
          : DEFAULT_PREFERENCES.voiceURI,
      speechRate: [0.75, 0.9, 1, 1.1].includes(candidate.speechRate ?? -1)
        ? (candidate.speechRate as Preferences["speechRate"])
        : DEFAULT_PREFERENCES.speechRate,
      speechPitch: [0.8, 1, 1.2].includes(candidate.speechPitch ?? -1)
        ? (candidate.speechPitch as Preferences["speechPitch"])
        : DEFAULT_PREFERENCES.speechPitch,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: Preferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export function loadCustomPhrases(): CustomPhrase[] {
  try {
    const value = localStorage.getItem(CUSTOM_PHRASES_KEY);
    if (!value) return [];
    const candidate = JSON.parse(value) as unknown;
    if (!Array.isArray(candidate)) return [];

    return candidate
      .filter(
        (phrase): phrase is CustomPhrase =>
          typeof phrase === "object" &&
          phrase !== null &&
          typeof (phrase as CustomPhrase).id === "string" &&
          typeof (phrase as CustomPhrase).label === "string",
      )
      .map((phrase) => ({
        id: phrase.id,
        label: normalizeCustomPhraseLabel(phrase.label),
      }))
      .filter((phrase) => phrase.label)
      .slice(0, 24);
  } catch {
    return [];
  }
}

export function saveCustomPhrases(phrases: readonly CustomPhrase[]): void {
  localStorage.setItem(CUSTOM_PHRASES_KEY, JSON.stringify(phrases));
}
