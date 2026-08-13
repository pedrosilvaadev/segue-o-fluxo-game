import { describe, expect, it } from "vitest";

import {
  QUESTION_CATEGORIES,
  type QuestionCategory,
} from "../types/question";
import { questions } from "./questions";

describe("question catalog", () => {
  it("contains at least 100 playable questions with unique IDs and texts", () => {
    const ids = questions.map(({ id }) => id);
    const normalizedTexts = questions.map(({ text }) =>
      text.trim().toLocaleLowerCase("pt-BR"),
    );

    expect(questions.length).toBeGreaterThanOrEqual(100);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(normalizedTexts).size).toBe(normalizedTexts.length);
    expect(questions.every(({ enabled }) => enabled)).toBe(true);
  });

  it("uses valid, reviewable IDs and non-empty trimmed question text", () => {
    for (const item of questions) {
      expect(item.id).toMatch(/^q-\d{3}$/);
      expect(item.text).toBe(item.text.trim());
      expect(item.text.length).toBeGreaterThan(10);
      expect(item.text).toMatch(/\?$/);
      expect(item.text).not.toContain("\uFFFD");
    }
  });

  it("covers every supported category with a reasonably balanced distribution", () => {
    const counts = new Map<QuestionCategory, number>(
      QUESTION_CATEGORIES.map((category) => [category, 0] as const),
    );

    for (const item of questions) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }

    for (const category of QUESTION_CATEGORIES) {
      expect(counts.get(category), category).toBeGreaterThanOrEqual(10);
    }
  });
});
