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

import { StringUtils } from "@nestjs-port/core";
import { SimpleRecordSeparatorPolicy } from "./simple-record-separator-policy.js";

export class DefaultRecordSeparatorPolicy extends SimpleRecordSeparatorPolicy {
  private static readonly QUOTE = '"';
  private static readonly CONTINUATION = "\\";

  private _quoteCharacter: string;
  private _continuation: string;

  constructor(
    quoteCharacter = DefaultRecordSeparatorPolicy.QUOTE,
    continuation = DefaultRecordSeparatorPolicy.CONTINUATION,
  ) {
    super();
    this._quoteCharacter = quoteCharacter;
    this._continuation = continuation;
  }

  setQuoteCharacter(quoteCharacter: string): void {
    this._quoteCharacter = quoteCharacter;
  }

  setContinuation(continuation: string): void {
    this._continuation = continuation;
  }

  isEndOfRecord(line: string): boolean {
    return !this.isQuoteUnterminated(line) && !this.isContinued(line);
  }

  preProcess(line: string): string {
    if (this.isQuoteUnterminated(line)) {
      return `${line}\n`;
    }
    if (this.isContinued(line)) {
      return line.substring(0, line.lastIndexOf(this._continuation));
    }
    return line;
  }

  private isQuoteUnterminated(line: string | null = null): boolean {
    return (
      line != null &&
      StringUtils.countOccurrences(line, this._quoteCharacter) % 2 !== 0
    );
  }

  private isContinued(line: string | null | undefined): boolean {
    return line?.trim().endsWith(this._continuation) ?? false;
  }
}
