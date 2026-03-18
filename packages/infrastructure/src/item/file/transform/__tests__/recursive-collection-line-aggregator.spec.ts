import { EOL } from "node:os";
import { beforeEach, describe, expect, it } from "vitest";

import { RecursiveCollectionLineAggregator } from "../recursive-collection-line-aggregator";

describe("RecursiveCollectionLineAggregator", () => {
  let aggregator: RecursiveCollectionLineAggregator<string>;

  beforeEach(() => {
    aggregator = new RecursiveCollectionLineAggregator<string>();
  });

  it("test set delegate and pass empty collection", () => {
    aggregator.setDelegate({
      aggregate: () => "bar",
    });
    expect(aggregator.aggregate([])).toBe("");
  });

  it("test set delegate and pass in string", () => {
    aggregator.setDelegate({
      aggregate: () => "bar",
    });
    expect(aggregator.aggregate(["foo"])).toBe("bar");
  });

  it("test aggregate list with default line separator", () => {
    const result = aggregator.aggregate(["foo", "bar"]);
    const array = result.split(EOL);
    expect(array[0]).toBe("foo");
    expect(array[1]).toBe("bar");
  });

  it("test aggregate list with custom line separator", () => {
    aggregator.setLineSeparator("#");
    const result = aggregator.aggregate(["foo", "bar"]);
    const array = result.split("#");
    expect(array[0]).toBe("foo");
    expect(array[1]).toBe("bar");
  });
});
