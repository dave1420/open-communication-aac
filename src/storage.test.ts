import { afterEach, describe, expect, it, vi } from "vitest";
import { loadPreferences, savePreferences } from "./storage";

afterEach(() => vi.unstubAllGlobals());

describe("phrase picture preference", () => {
  it("keeps an older saved profile usable without resetting its settings", () => {
    vi.stubGlobal("localStorage", {
      getItem: () =>
        JSON.stringify({ columns: 2, targetSize: 104, lockoutMs: 300 }),
    });
    expect(loadPreferences()).toMatchObject({
      columns: 2,
      targetSize: 104,
      textSize: 20,
      lockoutMs: 300,
      showSymbols: true,
    });
  });

  it("preserves a saved text-only choice", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => JSON.stringify({ showSymbols: false }),
    });
    expect(loadPreferences().showSymbols).toBe(false);
  });
});

describe("independent text size preference", () => {
  it.each([20, 24, 28] as const)(
    "saves and restores %i px without changing button size",
    (textSize) => {
      const saved = new Map<string, string>();
      vi.stubGlobal("localStorage", {
        getItem: (key: string) => saved.get(key) ?? null,
        setItem: (key: string, value: string) => saved.set(key, value),
      });
      savePreferences({ ...loadPreferences(), targetSize: 72, textSize });
      expect(loadPreferences()).toMatchObject({ targetSize: 72, textSize });
    },
  );

  it.each([16, 32, "24", null])(
    "falls back safely for unsupported text size %s",
    (textSize) => {
      vi.stubGlobal("localStorage", {
        getItem: () => JSON.stringify({ textSize, targetSize: 104 }),
      });
      expect(loadPreferences()).toMatchObject({
        textSize: 20,
        targetSize: 104,
      });
    },
  );
});
