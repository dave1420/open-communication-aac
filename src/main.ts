import "./styles.css";
import { version } from "../package.json";
import {
  PHRASES,
  WORD_BANK,
  getCurrentWordPrefix,
  getNextWordSuggestions,
  getWordSuggestions,
  normalizeCustomPhraseLabel,
  replaceCurrentWord,
  shouldAcceptSelection,
  type CustomPhrase,
  type Preferences,
} from "./model";
import {
  loadCustomPhrases,
  loadPreferences,
  saveCustomPhrases,
  savePreferences,
} from "./storage";
import { GENERAL_ENGLISH_WORDS } from "./vocabulary";

let messageText = "";
let previousSpeech = "";
let lastSelectionTime = 0;
let lastKeyboardKey = "";
let lastKeyboardTime = 0;
let preferences = loadPreferences();
let customPhrases = loadCustomPhrases();
let availableVoices: SpeechSynthesisVoice[] = [];
const sessionWords: string[] = [];
const stateHistory: string[] = [];
const phraseChangeHistory: CustomPhrase[][] = [];
const STARTER_ROWS = [
  ["I need", "I am", "I want", "I feel", "Please", "Can you"],
  ["Help", "Water", "Bathroom", "Food", "Medicine", "Family"],
] as const;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Application root was not found.");

app.innerHTML = `
  <header class="app-header">
    <div>
      <p class="eyebrow">Communication aid</p>
      <h1>Open Communication AAC</h1>
    </div>
    <button id="settings-toggle" class="secondary-button mode-button" type="button" aria-expanded="false" aria-controls="settings-panel custom-phrase-panel">Edit &amp; settings</button>
  </header>

  <main>
    <section class="message-panel" aria-labelledby="message-heading">
      <h2 id="message-heading">My message</h2>
      <label class="visually-hidden" for="message-input">Message to speak</label>
      <textarea id="message-input" class="message-output" rows="2" autocomplete="off" autocapitalize="sentences" spellcheck="true" aria-describedby="status" placeholder="Choose a phrase or type a message below."></textarea>
      <div class="message-actions" aria-label="Message actions">
        <button id="speak" class="primary-button" type="button">Speak</button>
        <button id="repeat-speech" class="secondary-button" type="button">Repeat</button>
        <button id="undo" class="secondary-button" type="button">Undo</button>
        <button id="clear" class="danger-button" type="button">Clear text</button>
      </div>
      <p id="status" class="status" role="status" aria-live="polite"></p>
    </section>

    <section id="settings-panel" class="settings-panel" aria-labelledby="settings-heading" hidden>
      <h2 id="settings-heading">Caregiver &amp; access settings</h2>
      <p>These controls are hidden during everyday communication. Changes are saved on this device.</p>
      <div class="settings-grid">
        <label>Columns
          <select id="columns">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
        <label>Button size
          <select id="target-size">
            <option value="72">Large</option>
            <option value="88">Extra large</option>
            <option value="104">Maximum</option>
          </select>
        </label>
        <label>Repeat-tap protection
          <select id="lockout">
            <option value="0">Off</option>
            <option value="300">0.3 seconds</option>
            <option value="600">0.6 seconds</option>
            <option value="900">0.9 seconds</option>
          </select>
        </label>
        <label class="checkbox-label">
          <input id="speak-on-select" type="checkbox" />
          Speak each phrase when selected
        </label>
        <label>Voice
          <select id="voice-select">
            <option value="">System default</option>
          </select>
        </label>
        <label>Speaking speed
          <select id="speech-rate">
            <option value="0.75">Slow</option>
            <option value="0.9">Calm</option>
            <option value="1">Normal</option>
            <option value="1.1">Faster</option>
          </select>
        </label>
        <label>Voice pitch
          <select id="speech-pitch">
            <option value="0.8">Lower</option>
            <option value="1">Natural</option>
            <option value="1.2">Higher</option>
          </select>
        </label>
        <button id="preview-voice" class="secondary-button voice-preview" type="button">Preview voice</button>
        <p class="voice-note">Installed voices stay on this device. Voices labelled online may send spoken text to the browser's speech service.</p>
      </div>
    </section>

    <section class="typing-panel" aria-labelledby="typing-heading">
      <div class="section-heading typing-heading">
        <div>
          <h2 id="typing-heading">Type a message</h2>
          <p>Use the device keyboard or the large on-screen keyboard.</p>
        </div>
      </div>
      <div class="starter-area" aria-labelledby="starter-heading">
        <h3 id="starter-heading">Common starters and words</h3>
        <div id="starter-rows" class="starter-rows"></div>
      </div>
      <div class="suggestion-area" aria-labelledby="suggestion-heading">
        <h3 id="suggestion-heading">Word suggestions</h3>
        <div id="word-suggestions" class="word-suggestions" aria-live="polite">
          <p class="suggestion-hint">Type a letter to see suggestions.</p>
        </div>
      </div>
      <div id="on-screen-keyboard" class="on-screen-keyboard" role="group" aria-label="On-screen keyboard">
        <div id="letter-keys" class="letter-keys"></div>
        <div class="keyboard-actions">
          <button type="button" data-key="space">Space</button>
          <button type="button" data-key="backspace">Backspace</button>
          <button type="button" data-key="period">Period</button>
          <button type="button" data-key="question">Question mark</button>
        </div>
      </div>
      <p class="privacy-reminder">Predictions run on this device. Typed messages are not saved.</p>
    </section>

    <section aria-labelledby="phrases-heading">
      <div class="section-heading phrase-heading">
        <div>
          <h2 id="phrases-heading">Quick phrases</h2>
          <p>Select a phrase to add it to the message.</p>
        </div>
        <button id="edit-phrases" class="secondary-button" type="button" aria-expanded="false" aria-controls="custom-phrase-panel">Edit phrases</button>
      </div>
      <section id="custom-phrase-panel" class="custom-phrase-panel" aria-labelledby="custom-phrases-heading" hidden>
        <div>
          <h3 id="custom-phrases-heading">Make your own phrase button</h3>
          <p>Custom phrases are saved only on this device.</p>
        </div>
        <form id="custom-phrase-form" class="custom-phrase-form">
          <label for="custom-phrase-input">Button phrase</label>
          <input id="custom-phrase-input" type="text" maxlength="120" autocomplete="off" placeholder="For example: I would like some tea" />
          <div class="custom-phrase-actions">
            <button class="primary-button" type="submit">Add phrase</button>
            <button id="use-current-message" class="secondary-button" type="button">Use current message</button>
            <button id="undo-phrase-change" class="secondary-button" type="button" disabled>Undo phrase change</button>
          </div>
        </form>
        <div id="custom-phrase-list" class="custom-phrase-list" aria-label="Manage custom phrases"></div>
      </section>
      <div id="phrase-board" class="phrase-board" role="group" aria-label="Quick communication phrases"></div>
    </section>

    <footer class="app-footer">
      <span>Open Communication AAC</span>
      <span>Version ${version}</span>
    </footer>
  </main>
`;

const messageInput = getElement<HTMLTextAreaElement>("message-input");
const status = getElement<HTMLParagraphElement>("status");
const phraseBoard = getElement<HTMLDivElement>("phrase-board");
const customPhraseForm = getElement<HTMLFormElement>("custom-phrase-form");
const customPhraseInput = getElement<HTMLInputElement>("custom-phrase-input");
const customPhraseList = getElement<HTMLDivElement>("custom-phrase-list");
const undoPhraseChange = getElement<HTMLButtonElement>("undo-phrase-change");
const starterRows = getElement<HTMLDivElement>("starter-rows");
const wordSuggestions = getElement<HTMLDivElement>("word-suggestions");
const letterKeys = getElement<HTMLDivElement>("letter-keys");
const onScreenKeyboard = getElement<HTMLDivElement>("on-screen-keyboard");
const settingsPanel = getElement<HTMLElement>("settings-panel");
const settingsToggle = getElement<HTMLButtonElement>("settings-toggle");
const customPhrasePanel = getElement<HTMLElement>("custom-phrase-panel");
const editPhrases = getElement<HTMLButtonElement>("edit-phrases");
const columns = getElement<HTMLSelectElement>("columns");
const targetSize = getElement<HTMLSelectElement>("target-size");
const lockout = getElement<HTMLSelectElement>("lockout");
const speakOnSelect = getElement<HTMLInputElement>("speak-on-select");
const voiceSelect = getElement<HTMLSelectElement>("voice-select");
const speechRate = getElement<HTMLSelectElement>("speech-rate");
const speechPitch = getElement<HTMLSelectElement>("speech-pitch");

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Required element #${id} was not found.`);
  return element as T;
}

function speak(text: string, rememberForRepeat = true): void {
  if (!text) {
    setStatus("Choose a phrase or type a message first.");
    return;
  }
  if (!("speechSynthesis" in window)) {
    setStatus("Speech is not available in this browser.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = availableVoices.find(
    (voice) => voice.voiceURI === preferences.voiceURI,
  );
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = preferences.speechRate;
  utterance.pitch = preferences.speechPitch;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  if (rememberForRepeat) previousSpeech = text;
  rememberSessionWords(text);
  setStatus(`Speaking: ${text}`);
}

function setStatus(text: string): void {
  status.textContent = text;
}

function composeFullMessage(): string {
  return messageText.trim();
}

function updateMessage(): void {
  if (messageInput.value !== messageText) messageInput.value = messageText;
  updateSuggestions();
}

function rememberState(): void {
  stateHistory.push(messageText);
  if (stateHistory.length > 100) stateHistory.shift();
}

function rememberSessionWords(text: string): void {
  for (const word of text.match(/[A-Za-z']+/g) ?? []) {
    if (
      !sessionWords.some(
        (known) => known.toLocaleLowerCase() === word.toLocaleLowerCase(),
      )
    ) {
      sessionWords.unshift(word);
    }
  }
}

function* predictionCandidates(): Iterable<string> {
  yield* sessionWords;
  for (const phrase of customPhrases) {
    yield* phrase.label.match(/[A-Za-z']+/g) ?? [];
  }
  yield* WORD_BANK;
  for (const phrase of PHRASES) {
    yield* phrase.label.match(/[A-Za-z']+/g) ?? [];
  }
  yield* GENERAL_ENGLISH_WORDS;
}

function rememberPhraseChange(): void {
  phraseChangeHistory.push(customPhrases.map((phrase) => ({ ...phrase })));
  if (phraseChangeHistory.length > 50) phraseChangeHistory.shift();
  undoPhraseChange.disabled = false;
}

function persistAndRenderCustomPhrases(): void {
  saveCustomPhrases(customPhrases);
  renderPhrases();
  renderCustomPhraseList();
  updateSuggestions();
}

function selectPhrase(label: string): void {
  const currentTime = Date.now();
  if (
    !shouldAcceptSelection(
      currentTime,
      lastSelectionTime,
      preferences.lockoutMs,
    )
  ) {
    setStatus("Selection ignored by repeat-tap protection.");
    return;
  }
  lastSelectionTime = currentTime;
  appendQuickText(label);
  if (preferences.speakOnSelect) speak(label);
  else setStatus(`Added: ${label}`);
}

function makeCustomPhraseButton(phrase: CustomPhrase): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "phrase-button category-custom";
  button.setAttribute("aria-label", phrase.label);

  const symbol = document.createElement("span");
  symbol.className = "phrase-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = "★";
  const label = document.createElement("span");
  label.textContent = phrase.label;
  button.append(symbol, label);
  button.addEventListener("click", () => selectPhrase(phrase.label));
  return button;
}

function renderCustomPhraseList(): void {
  customPhraseList.replaceChildren();
  if (customPhrases.length === 0) return;

  const heading = document.createElement("h4");
  heading.textContent = "Your saved phrases";
  customPhraseList.append(heading);

  for (const phrase of customPhrases) {
    const row = document.createElement("div");
    row.className = "custom-phrase-row";
    const label = document.createElement("span");
    label.textContent = phrase.label;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove custom phrase: ${phrase.label}`);
    remove.addEventListener("click", () => {
      if (!window.confirm(`Remove the custom phrase “${phrase.label}”?`))
        return;
      rememberPhraseChange();
      customPhrases = customPhrases.filter((item) => item.id !== phrase.id);
      persistAndRenderCustomPhrases();
      setStatus(`Removed custom phrase: ${phrase.label}. Undo is available.`);
    });
    row.append(label, remove);
    customPhraseList.append(row);
  }
}

function updateSuggestions(): void {
  const prefix = getCurrentWordPrefix(messageText);
  const suggestions = prefix
    ? getWordSuggestions(prefix, predictionCandidates(), 3)
    : getNextWordSuggestions(messageText, 3);
  wordSuggestions.replaceChildren();

  if (suggestions.length === 0) {
    const hint = document.createElement("p");
    hint.className = "suggestion-hint";
    hint.textContent = prefix
      ? "No suggestions yet."
      : "Type a letter to see suggestions.";
    wordSuggestions.append(hint);
    return;
  }

  for (const suggestion of suggestions) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-button";
    button.textContent = suggestion;
    button.setAttribute("aria-label", `Complete word: ${suggestion}`);
    button.addEventListener("click", () => {
      rememberState();
      messageText = replaceCurrentWord(messageText, suggestion);
      rememberSessionWords(suggestion);
      updateMessage();
      messageInput.focus();
      setStatus(`Completed word: ${suggestion}`);
    });
    wordSuggestions.append(button);
  }
}

function appendQuickText(value: string): void {
  rememberState();
  const separator = messageText && !/\s$/.test(messageText) ? " " : "";
  const insertion = messageText ? value.toLocaleLowerCase() : value;
  messageText = `${messageText}${separator}${insertion} `;
  rememberSessionWords(value);
  updateMessage();
  messageInput.focus();
  setStatus(`Added: ${value}`);
}

function renderStarterRows(): void {
  for (const starters of STARTER_ROWS) {
    const row = document.createElement("div");
    row.className = "starter-row";
    for (const starter of starters) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "starter-button";
      button.textContent = starter;
      button.addEventListener("click", () => appendQuickText(starter));
      row.append(button);
    }
    starterRows.append(row);
  }
}

function applyPreferences(): void {
  document.documentElement.style.setProperty(
    "--board-columns",
    String(preferences.columns),
  );
  document.documentElement.style.setProperty(
    "--target-size",
    `${preferences.targetSize}px`,
  );
  columns.value = String(preferences.columns);
  targetSize.value = String(preferences.targetSize);
  lockout.value = String(preferences.lockoutMs);
  speakOnSelect.checked = preferences.speakOnSelect;
  speechRate.value = String(preferences.speechRate);
  speechPitch.value = String(preferences.speechPitch);
  if (
    [...voiceSelect.options].some(
      (option) => option.value === preferences.voiceURI,
    )
  ) {
    voiceSelect.value = preferences.voiceURI;
  }
  savePreferences(preferences);
}

function populateVoices(): void {
  if (!("speechSynthesis" in window)) return;
  const language = navigator.language.toLocaleLowerCase();
  const languageBase = language.split("-")[0];
  availableVoices = window.speechSynthesis
    .getVoices()
    .toSorted((first, second) => {
      const score = (voice: SpeechSynthesisVoice): number => {
        const voiceLanguage = voice.lang.toLocaleLowerCase();
        return (
          (voice.localService ? 100 : 0) +
          (voiceLanguage === language ? 40 : 0) +
          (voiceLanguage.split("-")[0] === languageBase ? 20 : 0) +
          (/natural|neural/i.test(voice.name) ? 10 : 0) +
          (voice.default ? 5 : 0)
        );
      };
      return (
        score(second) - score(first) || first.name.localeCompare(second.name)
      );
    });

  voiceSelect.replaceChildren(new Option("System default", ""));
  for (const voice of availableVoices) {
    const location = voice.localService ? "installed" : "online";
    voiceSelect.add(
      new Option(`${voice.name} — ${voice.lang} (${location})`, voice.voiceURI),
    );
  }
  voiceSelect.value = availableVoices.some(
    (voice) => voice.voiceURI === preferences.voiceURI,
  )
    ? preferences.voiceURI
    : "";
}

function renderPhrases(): void {
  phraseBoard.replaceChildren();
  for (const phrase of customPhrases) {
    phraseBoard.append(makeCustomPhraseButton(phrase));
  }
  for (const phrase of PHRASES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `phrase-button category-${phrase.category}`;
    button.setAttribute("aria-label", phrase.label);
    button.innerHTML = `<span class="phrase-symbol" aria-hidden="true">${phrase.symbol}</span><span>${phrase.label}</span>`;
    button.addEventListener("click", () => selectPhrase(phrase.label));
    phraseBoard.append(button);
  }
}

function acceptKeyboardKey(key: string): boolean {
  const currentTime = Date.now();
  const repeatedTooQuickly =
    key === lastKeyboardKey &&
    !shouldAcceptSelection(
      currentTime,
      lastKeyboardTime,
      preferences.lockoutMs,
    );
  lastKeyboardKey = key;
  lastKeyboardTime = currentTime;
  if (repeatedTooQuickly)
    setStatus("Repeated key ignored by repeat-tap protection.");
  return !repeatedTooQuickly;
}

function appendKeyboardText(key: string, value: string): void {
  if (!acceptKeyboardKey(key)) return;
  rememberState();
  messageText += value;
  updateMessage();
  messageInput.focus();
}

function renderKeyboard(): void {
  for (const letters of ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"]) {
    const row = document.createElement("div");
    row.className = "keyboard-row";
    row.style.setProperty("--key-count", String(letters.length));
    for (const letter of letters) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "letter-key";
      button.textContent = letter;
      button.setAttribute("aria-label", `Letter ${letter}`);
      button.addEventListener("click", () =>
        appendKeyboardText(letter, letter.toLocaleLowerCase()),
      );
      row.append(button);
    }
    letterKeys.append(row);
  }
}

function setEditMode(opening: boolean, focus: "settings" | "phrases"): void {
  settingsPanel.hidden = !opening;
  customPhrasePanel.hidden = !opening;
  settingsToggle.setAttribute("aria-expanded", String(opening));
  editPhrases.setAttribute("aria-expanded", String(opening));
  settingsToggle.textContent = opening ? "Done editing" : "Edit & settings";
  editPhrases.textContent = opening ? "Done editing" : "Edit phrases";

  if (opening) {
    if (focus === "phrases") customPhraseInput.focus();
    else columns.focus();
  }
}

settingsToggle.addEventListener("click", () => {
  const opening = Boolean(settingsPanel.hidden);
  setEditMode(opening, "settings");
});

editPhrases.addEventListener("click", () => {
  const opening = Boolean(customPhrasePanel.hidden);
  setEditMode(opening, "phrases");
});

columns.addEventListener("change", () => {
  preferences = {
    ...preferences,
    columns: Number(columns.value) as Preferences["columns"],
  };
  applyPreferences();
});

targetSize.addEventListener("change", () => {
  preferences = {
    ...preferences,
    targetSize: Number(targetSize.value) as Preferences["targetSize"],
  };
  applyPreferences();
});

lockout.addEventListener("change", () => {
  preferences = {
    ...preferences,
    lockoutMs: Number(lockout.value) as Preferences["lockoutMs"],
  };
  applyPreferences();
});

speakOnSelect.addEventListener("change", () => {
  preferences = { ...preferences, speakOnSelect: speakOnSelect.checked };
  applyPreferences();
});

voiceSelect.addEventListener("change", () => {
  preferences = { ...preferences, voiceURI: voiceSelect.value };
  applyPreferences();
});

speechRate.addEventListener("change", () => {
  preferences = {
    ...preferences,
    speechRate: Number(speechRate.value) as Preferences["speechRate"],
  };
  applyPreferences();
});

speechPitch.addEventListener("change", () => {
  preferences = {
    ...preferences,
    speechPitch: Number(speechPitch.value) as Preferences["speechPitch"],
  };
  applyPreferences();
});

getElement<HTMLButtonElement>("preview-voice").addEventListener("click", () =>
  speak("Hello. This is how the selected voice will sound.", false),
);

customPhraseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const label = normalizeCustomPhraseLabel(customPhraseInput.value);
  if (!label) {
    setStatus("Type a phrase before adding the button.");
    customPhraseInput.focus();
    return;
  }
  if (
    [...PHRASES, ...customPhrases].some(
      (phrase) =>
        phrase.label.toLocaleLowerCase() === label.toLocaleLowerCase(),
    )
  ) {
    setStatus("That phrase button already exists.");
    customPhraseInput.focus();
    return;
  }
  if (customPhrases.length >= 24) {
    setStatus(
      "The custom phrase limit is 24. Remove one before adding another.",
    );
    return;
  }

  rememberPhraseChange();
  customPhrases = [
    ...customPhrases,
    {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label,
    },
  ];
  customPhraseInput.value = "";
  persistAndRenderCustomPhrases();
  setStatus(`Added custom phrase button: ${label}. Undo is available.`);
});

getElement<HTMLButtonElement>("use-current-message").addEventListener(
  "click",
  () => {
    const label = normalizeCustomPhraseLabel(composeFullMessage());
    if (!label) {
      setStatus("Type a message first, then choose Use current message.");
      messageInput.focus();
      return;
    }
    customPhraseInput.value = label;
    customPhraseInput.focus();
    setStatus("Current message copied. Choose Add phrase to save it.");
  },
);

undoPhraseChange.addEventListener("click", () => {
  const previous = phraseChangeHistory.pop();
  if (!previous) return;
  customPhrases = previous;
  undoPhraseChange.disabled = phraseChangeHistory.length === 0;
  persistAndRenderCustomPhrases();
  setStatus("Last custom phrase change undone.");
});

getElement<HTMLButtonElement>("speak").addEventListener("click", () =>
  speak(composeFullMessage()),
);
getElement<HTMLButtonElement>("repeat-speech").addEventListener("click", () =>
  speak(previousSpeech),
);
getElement<HTMLButtonElement>("undo").addEventListener("click", () => {
  const previous = stateHistory.pop();
  if (previous !== undefined) messageText = previous;
  updateMessage();
  messageInput.focus();
  setStatus("Last change undone.");
});
getElement<HTMLButtonElement>("clear").addEventListener("click", () => {
  if (!composeFullMessage()) return;
  if (window.confirm("Clear all message text?")) {
    rememberState();
    messageText = "";
    updateMessage();
    messageInput.focus();
    setStatus("Message text cleared.");
  }
});

messageInput.addEventListener("input", () => {
  rememberState();
  messageText = messageInput.value;
  rememberSessionWords(messageText);
  updateMessage();
});

onScreenKeyboard.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-key]",
  );
  if (!button) return;
  const key = button.dataset.key;
  if (key === "space") appendKeyboardText("space", " ");
  if (key === "period") appendKeyboardText("period", ". ");
  if (key === "question") appendKeyboardText("question", "? ");
  if (key === "backspace") {
    if (!messageText || !acceptKeyboardKey("backspace")) return;
    rememberState();
    messageText = messageText.slice(0, -1);
    updateMessage();
    messageInput.focus();
  }
});

applyPreferences();
populateVoices();
if ("speechSynthesis" in window) {
  window.speechSynthesis.addEventListener("voiceschanged", populateVoices);
}
renderPhrases();
renderCustomPhraseList();
renderStarterRows();
renderKeyboard();
updateMessage();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      setStatus(
        "Offline setup was not completed. The app still works while online.",
      );
    });
  });
}
