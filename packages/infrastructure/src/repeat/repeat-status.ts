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

export class RepeatStatus {
  static readonly CONTINUABLE = new RepeatStatus(true);

  static readonly FINISHED = new RepeatStatus(false);

  private readonly _continuable: boolean;

  private constructor(continuable: boolean) {
    this._continuable = continuable;
  }

  static continueIf(continuable: boolean): RepeatStatus {
    return continuable ? RepeatStatus.CONTINUABLE : RepeatStatus.FINISHED;
  }

  get isContinuable(): boolean {
    return this === RepeatStatus.CONTINUABLE;
  }

  and(value: boolean): RepeatStatus {
    return value && this._continuable
      ? RepeatStatus.CONTINUABLE
      : RepeatStatus.FINISHED;
  }
}
