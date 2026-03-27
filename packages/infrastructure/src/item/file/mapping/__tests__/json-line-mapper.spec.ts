import { describe, expect, it } from "vitest";

import { JsonLineMapper } from "../json-line-mapper";

describe("JsonLineMapper", () => {
  const mapper = new JsonLineMapper();

  it("test map line", () => {
    const map = mapper.mapLine('{"foo": 1}', 1);
    expect(map.foo).toBe(1);
  });

  it("test map nested", () => {
    const map = mapper.mapLine('{"foo": 1, "bar" : {"foo": 2}}', 1);
    expect(map.foo).toBe(1);
    expect((map.bar as Record<string, unknown>).foo).toBe(2);
  });

  it("test mapping error", () => {
    expect(() => mapper.mapLine('{"foo": 1', 1)).toThrow(SyntaxError);
  });
});
