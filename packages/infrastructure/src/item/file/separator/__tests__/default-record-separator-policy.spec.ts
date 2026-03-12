import { describe, expect, it } from "vitest";

import { DefaultRecordSeparatorPolicy } from "../default-record-separator-policy";

describe("DefaultRecordSeparatorPolicy", () => {
  it("test normal line", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord("a string")).toBe(true);
  });

  it("test quote unterminated line", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord('a string"one')).toBe(false);
  });

  it("test empty line", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord("")).toBe(true);
  });

  it("test null line", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    expect(policy.isEndOfRecord(null as unknown as string)).toBe(true);
  });

  it("test post process", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo\nbar";
    expect(policy.postProcess(line)).toBe(line);
  });

  it("test pre process with quote", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = 'foo"bar';
    expect(policy.preProcess(line)).toBe(`${line}\n`);
  });

  it("test pre process with not default quote", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo'bar";
    policy.setQuoteCharacter("'");
    expect(policy.preProcess(line)).toBe(`${line}\n`);
  });

  it("test pre process without quote", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo";
    expect(policy.preProcess(line)).toBe(line);
  });

  it("test continuation marker not end", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo\\";
    expect(policy.isEndOfRecord(line)).toBe(false);
  });

  it("test not default continuation marker not end", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo bar";
    policy.setContinuation("bar");
    expect(policy.isEndOfRecord(line)).toBe(false);
  });

  it("test continuation marker removed", () => {
    const policy = new DefaultRecordSeparatorPolicy();
    const line = "foo\\";
    expect(policy.preProcess(line)).toBe("foo");
  });
});
