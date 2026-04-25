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

import { JsonLineMapper } from "../json-line-mapper.js";

describe("JsonLineMapper", () => {
  const mapper = new JsonLineMapper();

  it("test map line", () => {
    const map = mapper.mapLine('{"foo": 1}', 1);
    expect(map.foo).toBe(1);
  });

  it("test map nested", () => {
    const map = mapper.mapLine('{"foo": 1, "bar" : {"foo": 2}}', 1);
    expect(map.foo).toBe(1);
    expect((map.bar as Record<string, unknown>).foo).toBe(2);
  });

  it("test mapping error", () => {
    expect(() => mapper.mapLine('{"foo": 1', 1)).toThrow(SyntaxError);
  });
});
