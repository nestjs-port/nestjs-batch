/*
 * Copyright 2023-present the original author or authors.
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

import { StringToDateConverter } from "../string-to-date-converter.js";

describe("StringToDateConverter", () => {
  const converter = new StringToDateConverter();

  it("converts an ISO instant string", () => {
    const converted = converter.convert("1970-01-01T00:00:00Z");

    expect(converted).toEqual(new Date(0));
  });

  it("rejects a date-only string", () => {
    expect(() => converter.convert("1970-01-01")).toThrow(
      "Invalid ISO instant",
    );
  });
});
