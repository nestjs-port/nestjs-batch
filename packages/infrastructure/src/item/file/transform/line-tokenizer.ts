import type { FieldSet } from "./field-set.interface.js";

export interface LineTokenizer {
  tokenize(line: string): FieldSet;
}
