import { describe, expect, it } from "vitest";

import { SuffixRecordSeparatorPolicy } from "../suffix-record-separator-policy";

describe("SuffixRecordSeparatorPolicy", () => {
  const line = "a string";

  it("test normal line", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(policy.isEndOfRecord(line)).toBe(false);
  });

  it("test normal line with default suffix", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(
      policy.isEndOfRecord(
        `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}`,
      ),
    ).toBe(true);
  });

  it("test normal line with non default suffix", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    policy.setSuffix(":foo");
    expect(policy.isEndOfRecord(`${line}:foo`)).toBe(true);
  });

  it("test normal line with default suffix and whitespace", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(
      policy.isEndOfRecord(
        `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}  `,
      ),
    ).toBe(true);
  });

  it("test normal line with default suffix with ignore whitespace", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    policy.setIgnoreWhitespace(false);
    expect(
      policy.isEndOfRecord(
        `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}  `,
      ),
    ).toBe(false);
  });

  it("test empty line", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(policy.isEndOfRecord("")).toBe(false);
  });

  it("test post process sunny day", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    const record = `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}`;
    expect(policy.postProcess(record)).toBe(line);
  });
});
