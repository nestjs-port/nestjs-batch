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

/** Utility exception thrown by builders when they encounter unexpected checked exceptions. */
export class StepBuilderException extends Error {
  constructor(messageOrCause: string | unknown, cause: unknown | null = null) {
    const message =
      typeof messageOrCause === "string"
        ? messageOrCause
        : messageOrCause instanceof Error
          ? messageOrCause.message
          : String(messageOrCause);
    super(message, {
      cause: typeof messageOrCause === "string" ? cause : messageOrCause,
    });
  }
}
