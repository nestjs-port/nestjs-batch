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

/* oxlint-disable eslint-plugin-jest/no-export */

import { expect, it } from "vitest";

export function describeExceptionContract(
  create: (message: string) => Error,
  createWithCause: (message: string, cause: Error) => Error,
): void {
  it("test exception string", () => {
    const exception = create("foo");
    expect(exception.message).toBe("foo");
  });

  it("test exception string throwable", () => {
    const exception = createWithCause("foo", new Error());
    expect(exception.message.slice(0, 3)).toBe("foo");
  });
}
