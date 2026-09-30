import canadian10 from "wordlist-english/canadian-words-10.json";
import canadian20 from "wordlist-english/canadian-words-20.json";
import canadian35 from "wordlist-english/canadian-words-35.json";
import canadian40 from "wordlist-english/canadian-words-40.json";
import english10 from "wordlist-english/english-words-10.json";
import english20 from "wordlist-english/english-words-20.json";
import english35 from "wordlist-english/english-words-35.json";
import english40 from "wordlist-english/english-words-40.json";

// SCOWL frequency bands are ordered from common to less common. Canadian
// variants are inserted beside each band so local spellings are not demoted.
export const GENERAL_ENGLISH_WORDS: readonly string[] = [
  ...new Set([
    ...english10,
    ...canadian10,
    ...english20,
    ...canadian20,
    ...english35,
    ...canadian35,
    ...english40,
    ...canadian40,
  ]),
];
