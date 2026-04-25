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

import { PatternMatcher } from "../pattern-matcher.js";

const map = new Map<string, number>([
  ["an*", 3],
  ["a*", 2],
  ["big*", 4],
]);

const defaultMap = new Map<string, number>([
  ["an", 3],
  ["a", 2],
  ["big*", 4],
  ["big?*", 5],
  ["*", 1],
]);

describe("PatternMatcher", () => {
  describe("static match", () => {
    it("test match no wildcard yes", () => {
      expect(PatternMatcher.match("abc", "abc")).toBe(true);
    });

    it("test match no wildcard no", () => {
      expect(PatternMatcher.match("abc", "ab")).toBe(false);
    });

    it("test match single yes", () => {
      expect(PatternMatcher.match("a?c", "abc")).toBe(true);
    });

    it("test match single no", () => {
      expect(PatternMatcher.match("a?c", "ab")).toBe(false);
    });

    it("test match single wildcard no", () => {
      expect(PatternMatcher.match("a?*", "abc")).toBe(true);
    });

    it("test match star yes", () => {
      expect(PatternMatcher.match("a*c", "abdegc")).toBe(true);
    });

    it("test match two stars", () => {
      expect(PatternMatcher.match("a*d*", "abcdeg")).toBe(true);
    });

    it("test match past end", () => {
      expect(PatternMatcher.match("a*de", "abcdeg")).toBe(false);
    });

    it("test match past end two stars", () => {
      expect(PatternMatcher.match("a*d*g*", "abcdeg")).toBe(true);
    });

    it("test match star at end", () => {
      expect(PatternMatcher.match("ab*", "ab")).toBe(true);
    });

    it("test match star no", () => {
      expect(PatternMatcher.match("a*c", "abdeg")).toBe(false);
    });
  });

  describe("instance match", () => {
    it("test match prefix subsumed", () => {
      expect(new PatternMatcher(map).match("apple")).toBe(2);
    });

    it("test match prefix subsuming", () => {
      expect(new PatternMatcher(map).match("animal")).toBe(3);
    });

    it("test match prefix unrelated", () => {
      expect(new PatternMatcher(map).match("biggest")).toBe(4);
    });

    it("test match prefix no match", () => {
      const matcher = new PatternMatcher(map);
      expect(() => matcher.match("bat")).toThrow(/./);
    });

    it("test match prefix default value unrelated", () => {
      expect(new PatternMatcher(defaultMap).match("biggest")).toBe(5);
    });

    it("test match prefix default value empty string", () => {
      expect(new PatternMatcher(defaultMap).match("")).toBe(1);
    });

    it("test match prefix default value no match", () => {
      expect(new PatternMatcher(defaultMap).match("bat")).toBe(1);
    });
  });
});
