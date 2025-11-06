import { Position } from "./position";

export interface MatchReason {
  matchedKeywords: string[];
  matchedTags?: string[];
  fuzzyMatch: boolean;
  categoryBoost: boolean;
  boostedCategory?: string;
}

export interface MatchResult {
  position: Position;
  score: number;
  why: MatchReason;
}

