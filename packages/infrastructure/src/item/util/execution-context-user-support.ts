/*
 * Copyright 2006-2023 the original author or authors.
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

export class ExecutionContextUserSupport {
  private _name: string | undefined;

  constructor(name?: string) {
    this._name = name;
  }

  getName(): string | undefined {
    return this._name;
  }

  setName(name: string): void {
    this._name = name;
  }

  getKey(suffix: string): string {
    if (typeof this._name !== "string" || this._name.trim().length === 0) {
      throw new Error(
        "Name must be assigned for the sake of defining the execution context keys prefix.",
      );
    }
    return `${this._name}.${suffix}`;
  }
}
