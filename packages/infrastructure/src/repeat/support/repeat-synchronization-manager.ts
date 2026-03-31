/*
 * Copyright 2006-2025 the original author or authors.
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

import { AsyncLocalStorage } from "node:async_hooks";

import type { RepeatContext } from "../repeat-context";

type RepeatStore = {
  context: RepeatContext | null;
};

export class RepeatSynchronizationManager {
  private static readonly contextStorage = new AsyncLocalStorage<RepeatStore>();

  private constructor() {}

  static getContext(): RepeatContext | null {
    return this.contextStorage.getStore()?.context ?? null;
  }

  static setCompleteOnly(): void {
    const context = this.getContext();
    if (context != null) {
      context.setCompleteOnly();
    }
  }

  static register(context: RepeatContext): RepeatContext | null {
    const previous = this.getContext();
    const store = this.contextStorage.getStore();

    if (store != null) {
      store.context = context;
    } else {
      this.contextStorage.enterWith({ context });
    }

    return previous;
  }

  static clear(): RepeatContext | null {
    const context = this.getContext();
    const store = this.contextStorage.getStore();

    if (store != null) {
      store.context = null;
    }

    return context;
  }

  static setAncestorsCompleteOnly(): void {
    let context = this.getContext();
    while (context != null) {
      context.setCompleteOnly();
      context = context.parent;
    }
  }
}
