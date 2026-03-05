import { beforeEach, describe, expect, it } from "vitest";
import { ExecutionContext } from "../execution-context";

describe("ExecutionContext", () => {
  let context: ExecutionContext;

  beforeEach(() => {
    context = new ExecutionContext();
  });

  it("test normal usage", () => {
    context.putString("1", "testString1");
    context.putString("2", "testString2");
    context.putNumber("3", 3);
    context.putNumber("4", 4.4);
    context.putNumber("5", 5);

    expect(context.getString("1")).toBe("testString1");
    expect(context.getString("2")).toBe("testString2");
    expect(context.getString("55", "defaultString")).toBe("defaultString");
    expect(context.getNumber("4")).toBe(4.4);
    expect(context.getNumber("55", 5.5)).toBe(5.5);
    expect(context.getNumber("3")).toBe(3);
    expect(context.getNumber("55", 5)).toBe(5);
    expect(context.getNumber("5")).toBe(5);
    expect(context.getNumber("55", 6)).toBe(6);
  });

  it("test invalid cast", () => {
    context.putNumber("1", 1);
    expect(() => context.getString("1")).toThrow(TypeError);
  });

  it("test is empty", () => {
    expect(context.isEmpty).toBe(true);
    context.putString("1", "test");
    expect(context.isEmpty).toBe(false);
  });

  it("test dirty flag", () => {
    expect(context.isDirty).toBe(false);
    context.putString("1", "test");
    expect(context.isDirty).toBe(true);
    context.clearDirtyFlag();
    expect(context.isDirty).toBe(false);
  });

  it("test not dirty with duplicate", () => {
    context.putString("1", "test");
    expect(context.isDirty).toBe(true);
    context.clearDirtyFlag();
    context.putString("1", "test");
    expect(context.isDirty).toBe(false);
  });

  it("test dirty with remove missing", () => {
    context.putString("1", "test");
    expect(context.isDirty).toBe(true);
    context.putString("1", null); // remove an item that was present
    expect(context.isDirty).toBe(true);

    context.clearDirtyFlag();
    context.putString("1", null); // remove a non-existent item
    expect(context.isDirty).toBe(false);
  });

  it("test contains", () => {
    context.putString("1", "testString");
    expect(context.containsKey("1")).toBe(true);
    expect(context.containsValue("testString")).toBe(true);
  });

  it("test equals", () => {
    context.putString("1", "testString");
    const tempContext = new ExecutionContext();
    expect(tempContext.toMap()).not.toEqual(context.toMap());
    tempContext.putString("1", "testString");
    expect(tempContext.toMap()).toEqual(context.toMap());
  });

  // Putting null value is equivalent to removing the entry for the given key.
  it("test put null", () => {
    context.put("1", null);
    expect(context.get("1")).toBeNull();
    expect(context.containsKey("1")).toBe(false);
  });

  it("test get null", () => {
    expect(context.get("does not exist")).toBeNull();
  });

  it("test copy constructor", () => {
    const original = new ExecutionContext();
    original.put("foo", "bar");
    const copy = new ExecutionContext(original);
    expect(copy.toMap()).toEqual(original.toMap());
  });

  it("test dirty with duplicate", () => {
    context.put("1", "testString1");
    expect(context.isDirty).toBe(true);
    context.put("1", "testString1"); // put the same value
    expect(context.isDirty).toBe(true);
  });
});
