/*
 * Copyright 2002-present the original author or authors.
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

import "reflect-metadata";

export interface ListenerMethodMetadata {
  callback: string;
  methodName: string | symbol;
}

export abstract class AbstractListenerFactoryBean<T extends object> {
  private _delegate: object | null = null;

  setDelegate(delegate: object): void {
    this._delegate = delegate;
  }

  getObject(): T {
    if (this._delegate == null) {
      throw new Error("Delegate must not be null");
    }

    const callbacks = this.resolveCallbacks(this._delegate);
    if (callbacks.size === 0) {
      return this._delegate as T;
    }

    return new Proxy(this._delegate, {
      get: (target, property, receiver) => {
        const methodName = callbacks.get(String(property));
        if (methodName == null) {
          return Reflect.get(target, property, receiver);
        }

        const method = Reflect.get(target, methodName, receiver);
        return typeof method === "function" ? method.bind(target) : method;
      },
    }) as T;
  }

  isSingleton(): boolean {
    return true;
  }

  protected abstract getListenerCallbacks(): readonly string[];

  protected resolveCallbacks(delegate: object): Map<string, string | symbol> {
    const callbacks = new Map<string, string | symbol>();
    const callbackNames = new Set(this.getListenerCallbacks());

    for (const prototype of this.getPrototypeChain(delegate)) {
      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (methodName === "constructor") {
          continue;
        }

        if (
          callbackNames.has(methodName) &&
          typeof Reflect.get(delegate, methodName) === "function"
        ) {
          callbacks.set(methodName, methodName);
        }

        const metadata = Reflect.getMetadata(
          this.listenerMetadataKey,
          prototype,
          methodName,
        ) as ListenerMethodMetadata | undefined;
        if (metadata != null && callbackNames.has(metadata.callback)) {
          callbacks.set(metadata.callback, metadata.methodName);
        }
      }
    }

    return callbacks;
  }

  protected abstract readonly listenerMetadataKey: symbol;

  protected static isListener(
    target: unknown,
    callbacks: readonly string[],
    metadataKey: symbol,
  ): boolean {
    if (
      target == null ||
      (typeof target !== "object" && typeof target !== "function")
    ) {
      return false;
    }

    const callbackNames = new Set(callbacks);
    for (const prototype of AbstractListenerFactoryBean.getPrototypeChain(
      target,
    )) {
      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (callbackNames.has(methodName)) {
          return true;
        }

        const metadata = Reflect.getMetadata(
          metadataKey,
          prototype,
          methodName,
        ) as ListenerMethodMetadata | undefined;
        if (metadata != null && callbackNames.has(metadata.callback)) {
          return true;
        }
      }
    }

    return false;
  }

  private getPrototypeChain(target: object): object[] {
    return AbstractListenerFactoryBean.getPrototypeChain(target);
  }

  private static getPrototypeChain(target: object): object[] {
    const prototypes: object[] = [];
    let prototype =
      typeof target === "function"
        ? target.prototype
        : Object.getPrototypeOf(target);

    while (prototype != null && prototype !== Object.prototype) {
      prototypes.push(prototype);
      prototype = Object.getPrototypeOf(prototype);
    }

    return prototypes;
  }
}
