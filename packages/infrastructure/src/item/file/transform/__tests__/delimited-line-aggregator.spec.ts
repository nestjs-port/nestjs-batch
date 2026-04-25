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
