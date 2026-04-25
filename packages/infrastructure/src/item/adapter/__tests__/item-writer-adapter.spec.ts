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
