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

import { describe, expect, it } from "vitest";

import { ItemReaderAdapter } from "../item-reader-adapter.js";

interface Foo {
  id: number;
  name: string;
  value: number;
}

class FooService {
  static readonly GENERATION_LIMIT = 10;

  private _counter = 0;

  private readonly _generatedFoos: Foo[] = [];

  generateFoo(): Foo | null {
    if (this._counter++ >= FooService.GENERATION_LIMIT) {
      return null;
    }

    const foo: Foo = {
      id: this._counter,
      name: `foo${this._counter}`,
      value: this._counter,
    };
    this._generatedFoos.push(foo);
    return foo;
  }

  getGeneratedFoos(): Foo[] {
    return this._generatedFoos;
  }
}

describe("ItemReaderAdapter", () => {
  it("test next", async () => {
    const provider = new ItemReaderAdapter<Foo>();
    const fooService = new FooService();
    provider.setTargetObject(fooService);
    provider.setTargetMethod("generateFoo");
    provider.afterPropertiesSet();

    const returnedItems: Foo[] = [];
    let item: Foo | null;
    for (;;) {
      item = await provider.read();
      if (item == null) {
        break;
      }
      returnedItems.push(item);
    }

    const input = fooService.getGeneratedFoos();
    expect(input).toHaveLength(returnedItems.length);
    expect(returnedItems.length).toBeGreaterThan(0);

    for (let i = 0; i < input.length; i++) {
      expect(returnedItems[i]).toBe(input[i]);
    }
  });
});
