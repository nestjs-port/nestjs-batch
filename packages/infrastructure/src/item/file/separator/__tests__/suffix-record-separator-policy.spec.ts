import { describe, expect, it } from "vitest";

import { SuffixRecordSeparatorPolicy } from "../suffix-record-separator-policy";

describe("SuffixRecordSeparatorPolicy", () => {
  const line = "a string";

  it("testNormalLine", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(policy.isEndOfRecord(line)).toBe(false);
  });

  it("testNormalLineWithDefaultSuffix", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(policy.isEndOfRecord(line + SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX)).toBe(
      true,
    );
  });

  it("testNormalLineWithNonDefaultSuffix", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    policy.setSuffix(":foo");
    expect(policy.isEndOfRecord(line + ":foo")).toBe(true);
  });

  it("testNormalLineWithDefaultSuffixAndWhitespace", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(
      policy.isEndOfRecord(line + SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX + "  "),
    ).toBe(true);
  });

  it("testNormalLineWithDefaultSuffixWithIgnoreWhitespace", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    policy.setIgnoreWhitespace(false);
    expect(
      policy.isEndOfRecord(line + SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX + "  "),
    ).toBe(false);
  });

  it("testEmptyLine", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(policy.isEndOfRecord("")).toBe(false);
  });

  it("testPostProcessSunnyDay", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    const record = line + SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX;
    expect(policy.postProcess(record)).toBe(line);
  });
});
