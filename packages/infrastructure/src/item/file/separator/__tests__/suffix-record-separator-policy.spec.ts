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

import { SuffixRecordSeparatorPolicy } from "../suffix-record-separator-policy.js";

describe("SuffixRecordSeparatorPolicy", () => {
  const line = "a string";

  it("test normal line", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(policy.isEndOfRecord(line)).toBe(false);
  });

  it("test normal line with default suffix", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(
      policy.isEndOfRecord(
        `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}`,
      ),
    ).toBe(true);
  });

  it("test normal line with non default suffix", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    policy.setSuffix(":foo");
    expect(policy.isEndOfRecord(`${line}:foo`)).toBe(true);
  });

  it("test normal line with default suffix and whitespace", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(
      policy.isEndOfRecord(
        `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}  `,
      ),
    ).toBe(true);
  });

  it("test normal line with default suffix with ignore whitespace", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    policy.setIgnoreWhitespace(false);
    expect(
      policy.isEndOfRecord(
        `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}  `,
      ),
    ).toBe(false);
  });

  it("test empty line", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    expect(policy.isEndOfRecord("")).toBe(false);
  });

  it("test post process sunny day", () => {
    const policy = new SuffixRecordSeparatorPolicy();
    const record = `${line}${SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX}`;
    expect(policy.postProcess(record)).toBe(line);
  });
});
