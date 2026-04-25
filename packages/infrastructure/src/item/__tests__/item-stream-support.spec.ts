import { describe, expect, it } from "vitest";
import { ItemStreamSupport } from "../item-stream-support.js";

class SimpleItemStreamSupport extends ItemStreamSupport {
  constructor() {
    super();
  }

  testSetExecutionContextName(name: string): void {
    this.setExecutionContextName(name);
  }
}

describe("ItemStreamSupport", () => {
  it("test default name", () => {
    const itemStream = new SimpleItemStreamSupport();
    expect(itemStream.getExecutionContextKey("foo")).toBe(
      "SimpleItemStreamSupport.foo",
    );
  });

  it("test set name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.setName("name");
    expect(itemStream.getExecutionContextKey("foo")).toBe("name.foo");
  });

  it("test set execution context name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.testSetExecutionContextName("name");
    expect(itemStream.getExecutionContextKey("foo")).toBe("name.foo");
  });

  it("test bean name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.setBeanName("beanName");
    expect(itemStream.getExecutionContextKey("foo")).toBe("beanName.foo");
  });

  it("test explicit name takes precedence over bean name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.setName("explicitName");
    itemStream.setBeanName("beanName");
    expect(itemStream.getExecutionContextKey("foo")).toBe("explicitName.foo");
  });
});
