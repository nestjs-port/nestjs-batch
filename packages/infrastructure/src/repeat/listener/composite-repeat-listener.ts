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

import type { RepeatContext } from "../repeat-context.js";
import type { RepeatStatus } from "../repeat-status.js";
import type { RepeatListener } from "../repeat-listener.js";

/**
 * Allows a user to register one or more RepeatListeners to be notified on batch events.
 */
export class CompositeRepeatListener implements RepeatListener {
  private listeners: RepeatListener[] = [];

  /**
   * Convenience constructor for setting the RepeatListeners.
   */
  constructor(...listeners: RepeatListener[]);
  constructor(listeners: RepeatListener[]);
  constructor(...listeners: RepeatListener[] | [RepeatListener[]]) {
    if (listeners.length === 1 && Array.isArray(listeners[0])) {
      this.setListeners(listeners[0]);
      return;
    }

    this.setListeners(listeners as RepeatListener[]);
  }

  /**
   * Public setter for the listeners.
   */
  setListeners(listeners: RepeatListener[]): void {
    this.listeners = [...listeners];
  }

  /**
   * Register additional listener.
   */
  register(listener: RepeatListener): void {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }

  after(context: RepeatContext, result: RepeatStatus): void {
    for (const listener of this.listeners) {
      listener.after?.(context, result);
    }
  }

  before(context: RepeatContext): void {
    for (const listener of this.listeners) {
      listener.before?.(context);
    }
  }

  close(context: RepeatContext): void {
    for (const listener of this.listeners) {
      listener.close?.(context);
    }
  }

  onError(context: RepeatContext, error: unknown): void {
    for (const listener of this.listeners) {
      listener.onError?.(context, error);
    }
  }

  open(context: RepeatContext): void {
    for (const listener of this.listeners) {
      listener.open?.(context);
    }
  }
}
