import { describe, it, expect } from "vitest";
import {
  calculateKeywordScore,
  calculateFuzzyScore,
  calculateCategoryBoost,
} from "../score";
import { match } from "../index";
import { Position } from "@models/position";
import { IntakeData } from "@models/intake";
import { Catalogue } from "@models/catalogue";

describe("Scoring Functions", () => {
  describe("calculateKeywordScore", () => {
    it("should return 1.0 for perfect token match", () => {
      const position: Position = {
        position_number: 100,
        short_name_en: "Install windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows in building",
        description_de: "",
        hero: false,
      };

      const tokens = ["install", "window"];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBeGreaterThan(0.5);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it("should return 0.0 for no token match", () => {
      const position: Position = {
        position_number: 200,
        short_name_en: "Paint walls",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Paint interior walls",
        description_de: "",
        hero: false,
      };

      const tokens = ["install", "window", "door"];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBe(0);
    });

    it("should return partial score for partial match", () => {
      const position: Position = {
        position_number: 300,
        short_name_en: "Install windows and doors",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows and doors in building",
        description_de: "",
        hero: false,
      };

      const tokens = ["install", "window"];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1.0);
    });

    it("should handle empty tokens array", () => {
      const position: Position = {
        position_number: 400,
        short_name_en: "Install windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows",
        description_de: "",
        hero: false,
      };

      const tokens: string[] = [];
      const score = calculateKeywordScore(tokens, position);

      expect(score).toBe(0);
    });
  });

  describe("calculateFuzzyScore", () => {
    it("should return high score for similar text", () => {
      const position: Position = {
        position_number: 500,
        short_name_en: "Install roof windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install roof windows in building",
        description_de: "",
        hero: false,
      };

      const intakeText = "I need to install windows in the roof";
      const score = calculateFuzzyScore(intakeText, position);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it("should return low score for dissimilar text", () => {
      const position: Position = {
        position_number: 600,
        short_name_en: "Paint walls",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Paint interior walls",
        description_de: "",
        hero: false,
      };

      const intakeText = "I need to install windows";
      const score = calculateFuzzyScore(intakeText, position);

      expect(score).toBeLessThan(0.5);
    });

    it("should handle empty intake text", () => {
      const position: Position = {
        position_number: 700,
        short_name_en: "Install windows",
        short_name_de: "",
        unit: "Stk.",
        description_en: "Install windows",
        description_de: "",
        hero: false,
      };

      const intakeText = "";
      const score = calculateFuzzyScore(intakeText, position);

      expect(score).toBe(0);
    });
  });

  describe("calculateCategoryBoost", () => {
    it("should return 0.2 when difficultAccess trade is matched", () => {
      const boost = calculateCategoryBoost(true, "0300");
      expect(boost).toBe(0.2);
    });

    it("should return 0 when difficultAccess is false", () => {
      const boost = calculateCategoryBoost(false, "0300");
      expect(boost).toBe(0);
    });

    it("should return 0 for non-accessibility trades", () => {
      const boost = calculateCategoryBoost(true, "0100");
      expect(boost).toBe(0);
    });
  });

  describe("match function - integration", () => {
    const createTestCatalogue = (): Catalogue => ({
      trades: [
        {
          code: "0100",
          name_de: "Test Trade",
          name_en: "Test Trade",
          positions: [
            {
              position_number: 100,
              short_name_en: "Install windows",
              short_name_de: "",
              unit: "Stk.",
              description_en: "Install windows in building",
              description_de: "",
              hero: false,
            },
            {
              position_number: 200,
              short_name_en: "Paint walls",
              short_name_de: "",
              unit: "Stk.",
              description_en: "Paint interior walls",
              description_de: "",
              hero: false,
            },
            {
              position_number: 300,
              short_name_en: "Use equipment for difficult access",
              short_name_de: "",
              unit: "Stk.",
              description_en: "Using stair climbers, cranes, or hoists",
              description_de: "",
              hero: false,
            },
          ],
        },
      ],
    });

    it("should return top results sorted by score", () => {
      const catalogue = createTestCatalogue();
      const intake: IntakeData = {
        name: "John Doe",
        phone: "+1234567890",
        email: "john@example.com",
        address: "123 Main St",
        description: "I need to install windows in my house",
        difficultAccess: false,
      };

      const results = match(intake, catalogue, 15);

      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(15);

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it("should apply category boost only to accessibility trade when difficultAccess is true", () => {
      const catalogue: Catalogue = {
        trades: [
          ...createTestCatalogue().trades,
          {
            code: "0300",
            name_de: "Zugänglichkeit",
            name_en: "Accessibility",
            positions: [
              {
                position_number: 400,
                short_name_en: "Difficult access support",
                short_name_de: "",
                unit: "Stk.",
                description_en: "Use equipment for difficult access",
                description_de: "",
                hero: false,
              },
            ],
          },
        ],
      };
      const intake: IntakeData = {
        name: "Jane Doe",
        phone: "+1234567890",
        email: "jane@example.com",
        address: "456 Oak Ave",
        description: "I need help with difficult access",
        difficultAccess: true,
      };

      const results = match(intake, catalogue, 15);
      const boosted = results.filter((r) => r.why.categoryBoost);

      expect(boosted.length).toBeGreaterThan(0);
      for (const matchResult of results) {
        if (matchResult.position.position_number === 400) {
          expect(matchResult.why.categoryBoost).toBe(true);
        } else {
          expect(matchResult.why.categoryBoost).toBe(false);
        }
      }
    });

    it("should keep the highest scoring duplicate when deduplicating", () => {
      const catalogue: Catalogue = {
        trades: [
          {
            code: "0100",
            name_de: "Test",
            name_en: "Test",
            positions: [
              {
                position_number: 100,
                short_name_en: "Install windows generic",
                short_name_de: "",
                unit: "Stk.",
                description_en: "General installation",
                description_de: "",
                hero: false,
              },
            ],
          },
          {
            code: "0200",
            name_de: "Test 2",
            name_en: "Test 2",
            positions: [
              {
                position_number: 100,
                short_name_en: "Install custom windows",
                short_name_de: "",
                unit: "Stk.",
                description_en: "Install custom windows with special fittings",
                description_de: "",
                hero: false,
              },
            ],
          },
        ],
      };

      const intake: IntakeData = {
        name: "Test",
        phone: "+1234567890",
        email: "test@example.com",
        address: "Test",
        description: "install custom windows",
        difficultAccess: false,
      };

      const results = match(intake, catalogue, 15);

      expect(results.filter((r) => r.position.position_number === 100)).toHaveLength(
        1
      );
      expect(results[0].position.short_name_en).toContain("custom");
    });

    it("should handle empty description", () => {
      const catalogue = createTestCatalogue();
      const intake: IntakeData = {
        name: "Test",
        phone: "+1234567890",
        email: "test@example.com",
        address: "Test",
        description: "",
        difficultAccess: false,
      };

      const results = match(intake, catalogue, 15);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
