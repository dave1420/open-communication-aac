export interface Phrase {
  id: string;
  label: string;
  category: "essentials" | "comfort" | "conversation" | "people";
  symbol: string;
}

export interface CustomPhrase {
  id: string;
  label: string;
}

export function normalizeCustomPhraseLabel(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 120);
}

export interface Preferences {
  columns: 2 | 3 | 4;
  targetSize: 72 | 88 | 104;
  textSize: 20 | 24 | 28;
  lockoutMs: 0 | 300 | 600 | 900;
  speakOnSelect: boolean;
  showSymbols: boolean;
  voiceURI: string;
  speechRate: 0.75 | 0.9 | 1 | 1.1;
  speechPitch: 0.8 | 1 | 1.2;
}

export const DEFAULT_PREFERENCES: Preferences = {
  columns: 3,
  targetSize: 88,
  textSize: 20,
  lockoutMs: 600,
  speakOnSelect: true,
  showSymbols: true,
  voiceURI: "",
  speechRate: 0.9,
  speechPitch: 1,
};

export const PHRASES: readonly Phrase[] = [
  { id: "yes", label: "Yes", category: "essentials", symbol: "✓" },
  { id: "no", label: "No", category: "essentials", symbol: "✕" },
  { id: "wait", label: "Please wait", category: "essentials", symbol: "⏸" },
  {
    id: "repeat",
    label: "Please say that again",
    category: "essentials",
    symbol: "↻",
  },
  {
    id: "understand",
    label: "I understand",
    category: "conversation",
    symbol: "✓",
  },
  {
    id: "not-understand",
    label: "I do not understand",
    category: "conversation",
    symbol: "?",
  },
  {
    id: "bathroom",
    label: "I need the bathroom",
    category: "comfort",
    symbol: "WC",
  },
  { id: "pain", label: "I am in pain", category: "comfort", symbol: "!" },
  { id: "thirsty", label: "I am thirsty", category: "comfort", symbol: "●" },
  { id: "hungry", label: "I am hungry", category: "comfort", symbol: "○" },
  { id: "hot", label: "I am too hot", category: "comfort", symbol: "↑" },
  { id: "cold", label: "I am too cold", category: "comfort", symbol: "↓" },
  { id: "tired", label: "I am tired", category: "comfort", symbol: "Zz" },
  {
    id: "reposition",
    label: "Please help me reposition",
    category: "comfort",
    symbol: "↔",
  },
  {
    id: "thank-you",
    label: "Thank you",
    category: "conversation",
    symbol: "♥",
  },
];

export const WORD_BANK: readonly string[] = [
  "I",
  "please",
  "yes",
  "no",
  "need",
  "want",
  "am",
  "call",
  "can",
  "cannot",
  "help",
  "thank",
  "you",
  "the",
  "a",
  "to",
  "my",
  "me",
  "this",
  "that",
  "it",
  "is",
  "not",
  "more",
  "less",
  "now",
  "later",
  "stop",
  "wait",
  "again",
  "understand",
  "know",
  "think",
  "feel",
  "like",
  "do",
  "hello",
  "goodbye",
  "okay",
  "maybe",
  "phone",
  "answer",
  "repeat",
  "speak",
  "slowly",
  "louder",
  "quieter",
  "water",
  "coffee",
  "tea",
  "juice",
  "milk",
  "food",
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "bathroom",
  "shower",
  "pain",
  "headache",
  "dizzy",
  "nauseous",
  "breathing",
  "chest",
  "stomach",
  "medicine",
  "doctor",
  "nurse",
  "family",
  "friend",
  "wife",
  "husband",
  "mother",
  "father",
  "son",
  "daughter",
  "home",
  "bed",
  "chair",
  "blanket",
  "pillow",
  "glasses",
  "television",
  "remote",
  "hot",
  "cold",
  "tired",
  "comfortable",
  "uncomfortable",
  "happy",
  "sad",
  "good",
  "bad",
  "morning",
  "afternoon",
  "evening",
  "tonight",
  "today",
  "tomorrow",
  "yesterday",
  "left",
  "right",
  "up",
  "down",
  "open",
  "close",
  "turn",
  "move",
  "sit",
  "stand",
  "here",
  "there",
  "what",
  "when",
  "where",
  "who",
  "why",
  "how",
];

const NEXT_WORD_PREDICTIONS: Readonly<Record<string, readonly string[]>> = {
  "i need": ["help", "water", "the bathroom"],
  "i am": ["tired", "in pain", "too hot"],
  "i want": ["water", "food", "to go home"],
  "i feel": ["good", "uncomfortable", "sad"],
  please: ["help me", "wait", "say that again"],
  "can you": ["help me", "repeat that"],
};

export function appendPhrase(
  message: readonly string[],
  phrase: string,
): string[] {
  const normalized = phrase.trim();
  return normalized ? [...message, normalized] : [...message];
}

export function removeLastPhrase(message: readonly string[]): string[] {
  return message.slice(0, -1);
}

export function composeMessage(message: readonly string[]): string {
  return message.join(" ").trim();
}

export function shouldAcceptSelection(
  currentTime: number,
  previousTime: number,
  lockoutMs: number,
): boolean {
  return previousTime === 0 || currentTime - previousTime >= lockoutMs;
}

export function getCurrentWordPrefix(text: string): string {
  return text.match(/[A-Za-z']+$/)?.[0] ?? "";
}

export function replaceCurrentWord(text: string, replacement: string): string {
  const prefix = getCurrentWordPrefix(text);
  const base = prefix ? text.slice(0, -prefix.length) : text;
  return `${base}${replacement} `;
}

export function getWordSuggestions(
  prefix: string,
  candidates: Iterable<string>,
  limit = 3,
): string[] {
  const normalizedPrefix = prefix.toLocaleLowerCase();
  if (!normalizedPrefix) return [];

  const seen = new Set<string>();
  const suggestions: string[] = [];
  for (const candidate of candidates) {
    const normalized = candidate.toLocaleLowerCase();
    if (
      normalized === normalizedPrefix ||
      !normalized.startsWith(normalizedPrefix) ||
      seen.has(normalized)
    ) {
      continue;
    }
    seen.add(normalized);
    suggestions.push(candidate);
    if (suggestions.length >= limit) break;
  }
  return suggestions;
}

export function getNextWordSuggestions(text: string, limit = 3): string[] {
  const normalized = text.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  if (!normalized) return [];

  const matchingStarter = Object.keys(NEXT_WORD_PREDICTIONS)
    .sort((first, second) => second.length - first.length)
    .find((starter) => normalized.endsWith(starter));

  return matchingStarter
    ? [...(NEXT_WORD_PREDICTIONS[matchingStarter] ?? [])].slice(0, limit)
    : [];
}
