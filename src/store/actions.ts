import { Catalogue } from "@models/catalogue";
import { MatchResult } from "@models/match";
import { PageState } from "./types";

export interface AppActions {
  setCatalogue: (catalogue: Catalogue | null) => void;
  setResults: (results: MatchResult[]) => void;
  setPageState: (state: PageState) => void;
  setErrorMessage: (message: string) => void;
  clearResults: () => void;
  resetError: () => void;
}
