import { describe, expect, it } from "vitest";

import { DefaultRecordSeparatorPolicy } from "../default-record-separator-policy";

describe("DefaultRecordSeparatorPolicy", () => {
  it("testNormalLine", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord("a string")).toBe(true);
  });

  it("testQuoteUnterminatedLine", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord('a string"one')).toBe(false);
  });

  it("testEmptyLine", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord("")).toBe(true);
  });

  it("testNullLine", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord(null as unknown as string)).toBe(true);
  });

  it("testPostProcess", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo\nbar";
    expect(policy.postProcess(line)).toBe(line);
  });

  it("testPreProcessWithQuote", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = 'foo"bar';
    expect(policy.preProcess(line)).toBe(`${line}\n`);
  });

  it("testPreProcessWithNotDefaultQuote", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo'bar";
    policy.setQuoteCharacter("'");
    expect(policy.preProcess(line)).toBe(`${line}\n`);
  });

  it("testPreProcessWithoutQuote", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo";
    expect(policy.preProcess(line)).toBe(line);
  });

  it("testContinuationMarkerNotEnd", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo\\";
    expect(policy.isEndOfRecord(line)).toBe(false);
  });

  it("testNotDefaultContinuationMarkerNotEnd", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo bar";
    policy.setContinuation("bar");
    expect(policy.isEndOfRecord(line)).toBe(false);
  });

  it("testContinuationMarkerRemoved", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo\\";
    expect(policy.preProcess(line)).toBe("foo");
  });
});
