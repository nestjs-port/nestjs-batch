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

import { Chunk } from "../../chunk.js";
import { ItemWriterAdapter } from "../item-writer-adapter.js";

interface Foo {
  id: number;
  name: string;
  value: number;
}

class FooService {
  static readonly GENERATION_LIMIT = 10;

  private _counter = 0;

  private readonly _generatedFoos: Foo[] = [];

  private readonly _processedFoos: Foo[] = [];

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

  processFoo(foo: Foo): void {
    this._processedFoos.push(foo);
  }

  getGeneratedFoos(): Foo[] {
    return this._generatedFoos;
  }

  getProcessedFoos(): Foo[] {
    return this._processedFoos;
  }
}

describe("ItemWriterAdapter", () => {
  it("test process", async () => {
    const processor = new ItemWriterAdapter<Foo>();
    const fooService = new FooService();
    processor.setTargetObject(fooService);
    processor.setTargetMethod("processFoo");
    processor.afterPropertiesSet();

    let foo: Foo | null;
    const foos = new Chunk<Foo>();
    for (;;) {
      foo = fooService.generateFoo();
      if (foo == null) {
        break;
      }
      foos.add(foo);
    }
    await processor.write(foos);

    const input = fooService.getGeneratedFoos();
    const processed = fooService.getProcessedFoos();
    expect(processed).toHaveLength(input.length);
    expect(fooService.getProcessedFoos().length).toBeGreaterThan(0);

    for (let i = 0; i < input.length; i++) {
      expect(processed[i]).toBe(input[i]);
    }
  });
});
