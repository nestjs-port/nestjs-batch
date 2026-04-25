import { beforeEach, describe, expect, it } from "vitest";
import { ExecutionContextUserSupport } from "../execution-context-user-support.js";

describe("ExecutionContextUserSupport", () => {
  let tested: ExecutionContextUserSupport;

  beforeEach(() => {
    tested = new ExecutionContextUserSupport();
  });

  it("test get key", () => {
    tested.setName("uniqueName");
    expect(tested.getKey("key")).toBe("uniqueName.key");
  });

  it("test get key with no name set", () => {
    tested.setName("");
    expect(() => tested.getKey("arbitrary string")).toThrow(
      "Name must be assigned for the sake of defining the execution context keys prefix.",
    );
  });
});
