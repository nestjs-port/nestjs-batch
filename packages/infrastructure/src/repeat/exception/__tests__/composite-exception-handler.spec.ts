import { describe, expect, it } from "vitest";
import type { RepeatContext } from "../../repeat-context";
import { CompositeExceptionHandler } from "../composite-exception-handler";

describe("CompositeExceptionHandler", () => {
  const handler = new CompositeExceptionHandler();

  it("should not throw with new handler", () => {
    expect(() =>
      handler.handleException(null as unknown as RepeatContext, new Error()),
    ).not.toThrow();
  });

  it("should delegate to all handlers", () => {
    const list: string[] = [];
    handler.setHandlers([
      {
        handleException: (_context, _throwable) => {
          list.push("1");
        },
      },
      {
        handleException: (_context, _throwable) => {
          list.push("2");
        },
      },
    ]);
    handler.handleException(null as unknown as RepeatContext, new Error());
    expect(list).toHaveLength(2);
    expect(list[0]).toBe("1");
    expect(list[1]).toBe("2");
  });
});
