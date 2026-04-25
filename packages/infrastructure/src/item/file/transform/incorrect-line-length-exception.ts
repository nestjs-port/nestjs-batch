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

import { FlatFileFormatException } from "./flat-file-format-exception.js";

export class IncorrectLineLengthException extends FlatFileFormatException {
  private readonly _actualLength: number;

  private readonly _expectedLength: number;

  constructor(
    message: string,
    expectedLength: number,
    actualLength: number,
    input: string,
  );
  constructor(message: string, expectedLength: number, actualLength: number);
  constructor(expectedLength: number, actualLength: number, input: string);
  constructor(expectedLength: number, actualLength: number);
  constructor(
    messageOrExpectedLength: string | number,
    expectedLengthOrActualLength: number,
    actualLengthOrInput: number | string | null = null,
    input: string | null = null,
  ) {
    if (typeof messageOrExpectedLength === "string") {
      const message = messageOrExpectedLength;
      const expectedLength = expectedLengthOrActualLength;
      const actualLength = actualLengthOrInput as number;

      super(message, input);
      this._expectedLength = expectedLength;
      this._actualLength = actualLength;
      return;
    }

    const expectedLength = messageOrExpectedLength;
    const actualLength = expectedLengthOrActualLength;
    const message = `Incorrect line length in record: expected ${expectedLength} actual ${actualLength}`;

    super(message, actualLengthOrInput as string | null);
    this._expectedLength = expectedLength;
    this._actualLength = actualLength;
  }

  get actualLength(): number {
    return this._actualLength;
  }

  get expectedLength(): number {
    return this._expectedLength;
  }
}
