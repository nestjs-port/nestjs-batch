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

import { describe, expect, it } from "vitest";

import { DefaultFieldSet } from "../default-field-set.js";
import { DelimitedLineTokenizer } from "../delimited-line-tokenizer.js";
import type { FieldSet } from "../field-set.interface.js";
import type { LineTokenizer } from "../line-tokenizer.js";
import { PatternMatchingCompositeLineTokenizer } from "../pattern-matching-composite-line-tokenizer.js";

describe("PatternMatchingCompositeLineTokenizer", () => {
  it("test empty key matches any line", () => {
    const map = new Map<string, LineTokenizer>([
      ["*", new DelimitedLineTokenizer()],
      ["foo", { tokenize: () => null as unknown as FieldSet }],
    ]);
    const tokenizer = new PatternMatchingCompositeLineTokenizer(map);
    const fields = tokenizer.tokenize("abc");
    expect(fields.fieldCount).toBe(1);
  });

  it("test empty key does not match when alternative available", () => {
    const map = new Map<string, LineTokenizer>([
      ["*", { tokenize: () => null as unknown as FieldSet }],
      ["foo*", new DelimitedLineTokenizer()],
    ]);
    const tokenizer = new PatternMatchingCompositeLineTokenizer(map);
    const fields = tokenizer.tokenize("foo,bar");
    expect(fields.readString(1)).toBe("bar");
  });

  it("test no match", () => {
    const tokenizer = new PatternMatchingCompositeLineTokenizer(
      new Map([["foo", new DelimitedLineTokenizer()]]),
    );
    expect(() => tokenizer.tokenize("nomatch")).toThrow(/./);
  });

  it("test match with prefix", () => {
    const tokenizer = new PatternMatchingCompositeLineTokenizer(
      new Map<string, LineTokenizer>([
        ["foo*", { tokenize: (line: string) => new DefaultFieldSet([line]) }],
      ]),
    );
    const fields = tokenizer.tokenize("foo bar");
    expect(fields.fieldCount).toBe(1);
    expect(fields.readString(0)).toBe("foo bar");
  });
});
