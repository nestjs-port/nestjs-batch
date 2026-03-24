import assert from "node:assert/strict";
import { PatternMatcher } from "../../../support";
import type { FieldSet } from "./field-set.interface";
import type { LineTokenizer } from "./line-tokenizer";

export class PatternMatchingCompositeLineTokenizer implements LineTokenizer {
  private _tokenizers: PatternMatcher<LineTokenizer>;

  constructor(tokenizers: Map<string, LineTokenizer>) {
    if (tokenizers.size === 0) {
      throw new Error("The 'tokenizers' property must be non-empty");
    }
    this._tokenizers = new PatternMatcher(tokenizers);
  }

  tokenize(line: string): FieldSet {
    return this._tokenizers.match(line).tokenize(line);
  }

  setTokenizers(tokenizers: Map<string, LineTokenizer>): void {
    assert(tokenizers.size > 0, "The 'tokenizers' property must be non-empty");

    this._tokenizers = new PatternMatcher(tokenizers);
  }
}
