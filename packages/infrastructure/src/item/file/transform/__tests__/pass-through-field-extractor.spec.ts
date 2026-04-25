import { describe, expect, it } from "vitest";
import type { FieldSet } from "../field-set.interface.js";
import { PassThroughFieldExtractor } from "../pass-through-field-extractor.js";

describe("PassThroughFieldExtractor", () => {
  it("test extract string", () => {
    const extractor = new PassThroughFieldExtractor<string>();
    const result = extractor.extract("abc");
    expect(result).toEqual(["abc"]);
  });

  it("test extract array", () => {
    const extractor = new PassThroughFieldExtractor<(string | null)[]>();
    const result = extractor.extract(["a", "b", null, "d"]);
    expect(result).toEqual(["a", "b", null, "d"]);
  });

  it("test extract field set", () => {
    const extractor = new PassThroughFieldExtractor<FieldSet>();
    const fieldSet = { values: ["a", "b", "", "d"] } as FieldSet;
    const result = extractor.extract(fieldSet);
    expect(result).toEqual(["a", "b", "", "d"]);
  });

  it("test extract collection", () => {
    const extractor = new PassThroughFieldExtractor<(string | null)[]>();
    const result = extractor.extract(["a", "b", null, "d"]);
    expect(result).toEqual(["a", "b", null, "d"]);
  });

  it("test extract map", () => {
    const extractor = new PassThroughFieldExtractor<
      Map<string, string | null>
    >();
    const map = new Map<string, string | null>([
      ["A", "a"],
      ["B", "b"],
      ["C", null],
      ["D", "d"],
    ]);
    const result = extractor.extract(map);
    expect(result).toEqual(["a", "b", null, "d"]);
  });
});
