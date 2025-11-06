export interface Position {
  position: string;
  shortName: string;
  unit: string;
  description: string;
  category: string;
  tags: string[];
}

export type Catalogue = Position[];

export interface IntakeData {
  name: string;
  phone: string;
  email: string;
  address: string;
  company?: string;
  description: string;
  difficultAccess: boolean;
}

export interface IntakeForm extends IntakeData {}

export interface MatchReason {
  matchedKeywords: string[];
  matchedTags: string[];
  fuzzyMatch: boolean;
  categoryBoost: boolean;
  boostedCategory?: string;
}

export interface MatchResult {
  position: Position;
  score: number;
  why: MatchReason;
}
