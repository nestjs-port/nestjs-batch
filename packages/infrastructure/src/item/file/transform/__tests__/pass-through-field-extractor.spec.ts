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
