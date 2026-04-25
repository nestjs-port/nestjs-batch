import { beforeEach, describe, expect, it } from "vitest";

import { DelimitedLineAggregator } from "../delimited-line-aggregator.js";

describe("DelimitedLineAggregator", () => {
  let aggregator: DelimitedLineAggregator<(string | null)[]>;

  beforeEach(() => {
    aggregator = new DelimitedLineAggregator<(string | null)[]>();
    aggregator.setFieldExtractor({
      extract: (item) => item,
    });
  });

  it("test set delimiter", () => {
    aggregator.setDelimiter(";");
    expect(aggregator.aggregate(["foo", "bar"])).toBe("foo;bar");
  });

  it("test set delimiter and quote", () => {
    aggregator.setDelimiter(";");
    aggregator.setQuoteCharacter('"');
    expect(aggregator.aggregate(["foo", "bar"])).toBe('"foo";"bar"');
  });

  it("test aggregate", () => {
    expect(aggregator.aggregate(["foo", "bar"])).toBe("foo,bar");
  });

  it("test aggregate with null", () => {
    expect(aggregator.aggregate(["foo", null, "bar"])).toBe("foo,,bar");
  });
});
