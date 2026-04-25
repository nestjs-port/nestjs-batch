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

import { DefaultRecordSeparatorPolicy } from "../default-record-separator-policy.js";

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
