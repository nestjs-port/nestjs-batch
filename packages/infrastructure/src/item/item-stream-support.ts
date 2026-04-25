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

import { ExecutionContextUserSupport } from "./util/index.js";

export abstract class ItemStreamSupport {
  private readonly _defaultName: string;

  private readonly _executionContextUserSupport =
    new ExecutionContextUserSupport();

  private _name: string;

  protected constructor() {
    this._defaultName = new.target.name;
    this._name = this._defaultName;
    this._executionContextUserSupport.setName(this._defaultName);
  }

  setName(name: string): void {
    this.setExecutionContextName(name);
  }

  setBeanName(name: string): void {
    if (this._name === this._defaultName) {
      this.setName(name);
    }
  }

  get name(): string {
    return this._executionContextUserSupport.getName() ?? this._name;
  }

  protected setExecutionContextName(name: string): void {
    this._name = name;
    this._executionContextUserSupport.setName(name);
  }

  getExecutionContextKey(key: string): string {
    return this._executionContextUserSupport.getKey(key);
  }
}
