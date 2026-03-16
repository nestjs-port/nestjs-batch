import { describe, expect, it } from "vitest";

import { ItemReaderAdapter } from "../item-reader-adapter";

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

    while ((item = await provider.read()) != null) {
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
