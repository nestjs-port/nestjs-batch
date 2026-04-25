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

export class FlatFileFormatException extends Error {
  private readonly _input: string | null;

  constructor(message: string);
  constructor(message: string, input: string);
  constructor(message: string, cause: unknown);
  constructor(message: string, inputOrCause: string | unknown | null = null) {
    if (typeof inputOrCause === "string") {
      super(message);
      this._input = inputOrCause;
      return;
    }

    super(message, inputOrCause != null ? { cause: inputOrCause } : undefined);
    this._input = null;
  }

  get input(): string | null {
    return this._input;
  }
}
