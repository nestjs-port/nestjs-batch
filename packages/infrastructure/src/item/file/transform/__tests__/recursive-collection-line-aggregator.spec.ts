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

import { EOL } from "node:os";
import { beforeEach, describe, expect, it } from "vitest";

import { RecursiveCollectionLineAggregator } from "../recursive-collection-line-aggregator.js";

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
