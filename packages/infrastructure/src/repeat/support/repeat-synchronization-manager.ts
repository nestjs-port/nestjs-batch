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

import type { RepeatContext } from "../repeat-context.js";

type RepeatStore = {
  context: RepeatContext | null;
};

export class RepeatSynchronizationManager {
  private static readonly contextStorage = new AsyncLocalStorage<RepeatStore>();

  private constructor() {}

  static getContext(): RepeatContext | null {
    return (
      RepeatSynchronizationManager.contextStorage.getStore()?.context ?? null
    );
  }

  static setCompleteOnly(): void {
    const context = RepeatSynchronizationManager.getContext();
    if (context != null) {
      context.setCompleteOnly();
    }
  }

  static register(context: RepeatContext): RepeatContext | null {
    const previous = RepeatSynchronizationManager.getContext();
    const store = RepeatSynchronizationManager.contextStorage.getStore();

    if (store != null) {
      store.context = context;
    } else {
      RepeatSynchronizationManager.contextStorage.enterWith({ context });
    }

    return previous;
  }

  static clear(): RepeatContext | null {
    const context = RepeatSynchronizationManager.getContext();
    const store = RepeatSynchronizationManager.contextStorage.getStore();

    if (store != null) {
      store.context = null;
    }

    return context;
  }

  static setAncestorsCompleteOnly(): void {
    let context = RepeatSynchronizationManager.getContext();
    while (context != null) {
      context.setCompleteOnly();
      context = context.parent;
    }
  }
}
