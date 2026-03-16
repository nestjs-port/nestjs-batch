import { describe, expect, it } from "vitest";

import { JsonRecordSeparatorPolicy } from "../json-record-separator-policy";

describe("JsonRecordSeparatorPolicy", () => {
  const policy = new JsonRecordSeparatorPolicy();

  it("test is end of record", () => {
    expect(policy.isEndOfRecord('{"a":"b"')).toBe(false);
    expect(policy.isEndOfRecord('{"a":"b"} ')).toBe(true);
  });

  it("test nested object", () => {
    expect(policy.isEndOfRecord('{"a": {"b": 2}')).toBe(false);
    expect(policy.isEndOfRecord('{"a": {"b": 2}} ')).toBe(true);
  });
});
