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

import type { RepeatContext } from "../repeat-context";

export class RepeatContextSupport implements RepeatContext {
  private readonly _parent: RepeatContext | null;
  private readonly _attributes = new Map<string, unknown>();
  private readonly _callbacks = new Map<string, Set<() => void>>();
  private _count = 0;
  private _completeOnly = false;
  private _terminateOnly = false;

  /**
   * Constructor for RepeatContextSupport. The parent can be null, but should be set to
   * the enclosing repeat context if there is one, e.g. if this context is an inner loop.
   * @param parent the parent context
   */
  constructor(parent: RepeatContext | null) {
    this._parent = parent;
  }

  get startedCount(): number {
    return this._count;
  }

  get isCompleteOnly(): boolean {
    return this._completeOnly;
  }

  setCompleteOnly(): void {
    this._completeOnly = true;
  }

  get isTerminateOnly(): boolean {
    return this._terminateOnly;
  }

  setTerminateOnly(): void {
    this._terminateOnly = true;
    this.setCompleteOnly();
  }

  get parent(): RepeatContext | null {
    return this._parent;
  }

  /**
   * Used by clients to increment the started count.
   */
  increment(): void {
    this._count += 1;
  }

  registerDestructionCallback(name: string, callback: () => void): void {
    let callbacks = this._callbacks.get(name);
    if (!callbacks) {
      callbacks = new Set();
      this._callbacks.set(name, callbacks);
    }
    callbacks.add(callback);
  }

  close(): void {
    const errors: Error[] = [];
    const callbackGroups = [...this._callbacks.values()].map((callbacks) => [
      ...callbacks,
    ]);

    for (const callbacks of callbackGroups) {
      for (const callback of callbacks) {
        // The Java implementation always executes registered callbacks if they exist.
        if (callback == null) {
          continue;
        }
        try {
          callback();
        } catch (error) {
          if (error instanceof Error) {
            errors.push(error);
          } else {
            errors.push(new Error(String(error)));
          }
        }
      }
    }

    if (errors.length > 0) {
      throw errors[0];
    }
  }

  setAttribute(name: string, value: unknown): void {
    this._attributes.set(name, value);
  }

  getAttribute(name: string): unknown | null {
    return this._attributes.get(name) ?? null;
  }

  removeAttribute(name: string): unknown | null {
    const value = this._attributes.get(name);
    this._attributes.delete(name);
    return value ?? null;
  }

  hasAttribute(name: string): boolean {
    return this._attributes.has(name);
  }

  attributeNames(): string[] {
    return [...this._attributes.keys()];
  }
}
