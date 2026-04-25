import { describe, expect, it } from "vitest";

import { DefaultFieldSet } from "../default-field-set";
import { DelimitedLineTokenizer } from "../delimited-line-tokenizer";
import type { FieldSet } from "../field-set.interface";
import type { LineTokenizer } from "../line-tokenizer";
import { PatternMatchingCompositeLineTokenizer } from "../pattern-matching-composite-line-tokenizer";

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
