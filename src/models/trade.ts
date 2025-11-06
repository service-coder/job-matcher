import { Position } from "./position";

export interface Trade {
  code: string;
  name_de: string;
  name_en: string;
  positions: Position[];
}

