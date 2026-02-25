import type { FieldSet } from "./field-set.interface";

export interface LineTokenizer {
  tokenize(line: string): FieldSet;
}
