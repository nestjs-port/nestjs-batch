/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import assert from "node:assert/strict";
import { PatternMatcher } from "../../../support/index.js";
import type { FieldSet } from "./field-set.interface.js";
import type { LineTokenizer } from "./line-tokenizer.js";

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
