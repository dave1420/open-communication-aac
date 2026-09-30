import { describe, expect, it } from "vitest";
import {
  WORD_BANK,
  appendPhrase,
  composeMessage,
  getCurrentWordPrefix,
  getNextWordSuggestions,
  getWordSuggestions,
  normalizeCustomPhraseLabel,
  removeLastPhrase,
  replaceCurrentWord,
  shouldAcceptSelection,
} from "./model";

describe("message composition", () => {
  it("adds trimmed phrases without changing the prior array", () => {
    const original = ["Yes"];
    const result = appendPhrase(original, "  Please wait  ");
    expect(result).toEqual(["Yes", "Please wait"]);
    expect(original).toEqual(["Yes"]);
  });

  it("removes only the most recent phrase", () => {
    expect(removeLastPhrase(["I am thirsty", "Please wait"])).toEqual([
      "I am thirsty",
    ]);
  });

  it("composes a spoken message", () => {
    expect(composeMessage(["Please wait", "I am tired"])).toBe(
      "Please wait I am tired",
    );
  });
});

describe("repeat-tap protection", () => {
  it("accepts a first selection", () => {
    expect(shouldAcceptSelection(1_000, 0, 600)).toBe(true);
  });

  it("rejects a selection inside the lockout window", () => {
    expect(shouldAcceptSelection(1_400, 1_000, 600)).toBe(false);
  });

  it("accepts a selection at the lockout boundary", () => {
    expect(shouldAcceptSelection(1_600, 1_000, 600)).toBe(true);
  });
});

describe("custom phrase buttons", () => {
  it("normalizes extra whitespace", () => {
    expect(normalizeCustomPhraseLabel("  I   would like tea  ")).toBe(
      "I would like tea",
    );
  });

  it("limits a saved phrase to 120 characters", () => {
    expect(normalizeCustomPhraseLabel("a".repeat(140))).toHaveLength(120);
  });
});

describe("local word prediction", () => {
  it("finds the incomplete word at the cursor end", () => {
    expect(getCurrentWordPrefix("I would like wat")).toBe("wat");
    expect(getCurrentWordPrefix("I am ready ")).toBe("");
  });

  it("returns unique prefix matches without repeating a completed word", () => {
    expect(
      getWordSuggestions("th", ["the", "thank", "the", "this"], 3),
    ).toEqual(["the", "thank", "this"]);
    expect(getWordSuggestions("the", ["the", "there"])).toEqual(["there"]);
  });

  it("suggests everyday words independently of phrase buttons", () => {
    expect(getWordSuggestions("cal", WORD_BANK)).toContain("call");
    expect(getWordSuggestions("bla", WORD_BANK)).toContain("blanket");
    expect(getWordSuggestions("mor", WORD_BANK)).toContain("morning");
  });

  it("replaces the incomplete word and adds a space", () => {
    expect(replaceCurrentWord("I need wat", "water")).toBe("I need water ");
  });

  it("offers contextual next words after a common starter", () => {
    expect(getNextWordSuggestions("I need ")).toEqual([
      "help",
      "water",
      "the bathroom",
    ]);
    expect(getNextWordSuggestions("I am ")).toEqual([
      "tired",
      "in pain",
      "too hot",
    ]);
  });
});
