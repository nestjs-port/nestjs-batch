import { describe, expect, it } from "vitest";

import { JobParameter } from "../job-parameter";

describe("JobParameter", () => {
  it("test constructor name not null", () => {
    expect(
      () => new JobParameter(null as unknown as string, "test", String, true),
    ).toThrow("name must not be null");
  });

  it("test constructor value not null", () => {
    expect(
      () => new JobParameter("param", null as unknown as string, String, true),
    ).toThrow("value must not be null");
  });

  it("test constructor type not null", () => {
    expect(
      () =>
        new JobParameter(
          "param",
          "test",
          null as unknown as new (...args: never[]) => string,
          true,
        ),
    ).toThrow("type must not be null");
  });

  it("test string parameter", () => {
    const jobParameter = new JobParameter("param", "test", String, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toBe("test");
    expect(jobParameter.type).toBe(String);
    expect(jobParameter.identifying).toBe(true);
  });

  it("test long parameter", () => {
    const jobParameter = new JobParameter("param", 1, Number, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toBe(1);
    expect(jobParameter.type).toBe(Number);
    expect(jobParameter.identifying).toBe(true);
  });

  it("test double parameter", () => {
    const jobParameter = new JobParameter("param", 1.1, Number, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toBe(1.1);
    expect(jobParameter.type).toBe(Number);
    expect(jobParameter.identifying).toBe(true);
  });

  it("test date parameter", () => {
    const epoch = new Date(0);
    const jobParameter = new JobParameter("param", epoch, Date, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toEqual(new Date(0));
    expect(jobParameter.type).toBe(Date);
    expect(jobParameter.identifying).toBe(true);
  });

  // Job parameters are equal if their names are equal

  it("test equals", () => {
    const jobParameter = new JobParameter("param", "test1", String, true);
    const testParameter = new JobParameter("param", "test2", String, true);
    expect(jobParameter.equals(testParameter)).toBe(true);
  });
});
