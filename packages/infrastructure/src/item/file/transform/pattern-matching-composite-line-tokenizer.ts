import { PatternMatcher } from "../../../support/index.js";
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
    if (tokenizers.size === 0) {
      throw new Error("The 'tokenizers' property must be non-empty");
    }
    this._tokenizers = new PatternMatcher(tokenizers);
  }
}
