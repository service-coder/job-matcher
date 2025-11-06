import { Catalogue } from "@models/catalogue";
import { MatchResult } from "@models/match";

export type PageState = "loading" | "error" | "empty" | "ready";

export interface AppState {
  catalogue: Catalogue | null;
  results: MatchResult[];
  pageState: PageState;
  errorMessage: string;
}
