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
import type { RepeatContext } from "../../repeat-context.js";
import { CompositeExceptionHandler } from "../composite-exception-handler.js";

describe("CompositeExceptionHandler", () => {
  const handler = new CompositeExceptionHandler();

  it("should not throw with new handler", () => {
    expect(() =>
      handler.handleException(null as unknown as RepeatContext, new Error()),
    ).not.toThrow();
  });

  it("should delegate to all handlers", () => {
    const list: string[] = [];
    handler.setHandlers([
      {
        handleException: (_context, _throwable) => {
          list.push("1");
        },
      },
      {
        handleException: (_context, _throwable) => {
          list.push("2");
        },
      },
    ]);
    handler.handleException(null as unknown as RepeatContext, new Error());
    expect(list).toHaveLength(2);
    expect(list[0]).toBe("1");
    expect(list[1]).toBe("2");
  });
});
