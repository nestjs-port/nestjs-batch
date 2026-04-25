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

import { DefaultRecordSeparatorPolicy } from "./default-record-separator-policy.js";

export class SuffixRecordSeparatorPolicy extends DefaultRecordSeparatorPolicy {
  static readonly DEFAULT_SUFFIX = ";";

  private _suffix = SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX;
  private _ignoreWhitespace = true;

  setSuffix(suffix: string): void {
    this._suffix = suffix;
  }

  setIgnoreWhitespace(ignoreWhitespace: boolean): void {
    this._ignoreWhitespace = ignoreWhitespace;
  }

  isEndOfRecord(line: string): boolean {
    const trimmed = this._ignoreWhitespace ? line.trim() : line;
    return trimmed.endsWith(this._suffix);
  }

  postProcess(record: string): string {
    return record.substring(0, record.lastIndexOf(this._suffix));
  }
}
