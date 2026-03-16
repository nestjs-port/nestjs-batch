import { describe, expect, it } from "vitest";

import { ItemProcessorAdapter } from "../item-processor-adapter";

interface Foo {
  id: number;
  name: string;
  value: number;
}

class FooService {
  extractName(foo: Foo): string {
    return foo.name;
  }
}

describe("ItemProcessorAdapter", () => {
  it("test process", async () => {
    const processor = new ItemProcessorAdapter<Foo, string>();
    processor.setTargetObject(new FooService());
    processor.setTargetMethod("extractName");
    processor.afterPropertiesSet();

    const item: Foo = { id: 0, name: "foo", value: 1 };
    await expect(processor.process(item)).resolves.toBe("foo");
  });
});
