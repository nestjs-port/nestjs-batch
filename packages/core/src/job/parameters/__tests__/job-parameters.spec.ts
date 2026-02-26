import { beforeEach, describe, expect, it } from "vitest";

import { JobParameter } from "../job-parameter";
import { JobParameters } from "../job-parameters";

describe("JobParameters", () => {
  const date1 = new Date(4321431242);
  const date2 = new Date(7809089900);

  let parameters: JobParameters;

  function getNewParameters(): JobParameters {
    return new JobParameters(
      new Map<string, JobParameter>([
        [
          "string.key1",
          new JobParameter("string.key1", "value1", String, true),
        ],
        [
          "string.key2",
          new JobParameter("string.key2", "value2", String, true),
        ],
        ["number.key1", new JobParameter("number.key1", 1, Number, true)],
        ["number.key2", new JobParameter("number.key2", 2, Number, true)],
        ["double.key1", new JobParameter("double.key1", 1.1, Number, true)],
        ["double.key2", new JobParameter("double.key2", 2.2, Number, true)],
        ["date.key1", new JobParameter("date.key1", date1, Date, true)],
        ["date.key2", new JobParameter("date.key2", date2, Date, true)],
      ]),
    );
  }

  beforeEach(() => {
    parameters = getNewParameters();
  });

  it("test get string", () => {
    expect(parameters.getString("string.key1")).toBe("value1");
    expect(parameters.getString("string.key2")).toBe("value2");
  });

  it("test get number", () => {
    expect(parameters.getNumber("number.key1")).toBe(1);
    expect(parameters.getNumber("number.key2")).toBe(2);
  });

  it("test get double", () => {
    expect(parameters.getNumber("double.key1")).toBe(1.1);
    expect(parameters.getNumber("double.key2")).toBe(2.2);
  });

  it("test get date", () => {
    expect(parameters.getDate("date.key1")).toEqual(date1);
    expect(parameters.getDate("date.key2")).toEqual(date2);
  });

  it("test get missing number", () => {
    expect(parameters.getNumber("missing.number1")).toBeUndefined();
  });

  it("test is empty when empty", () => {
    expect(new JobParameters().isEmpty).toBe(true);
  });

  it("test is empty when not empty", () => {
    expect(parameters.isEmpty).toBe(false);
  });

  it("test equals", () => {
    const testParameters = getNewParameters();
    expect(parameters.equals(testParameters)).toBe(true);
  });

  it("test equals self", () => {
    expect(parameters.equals(parameters)).toBe(true);
  });

  it("test equals different", () => {
    expect(parameters.equals(new JobParameters())).toBe(false);
  });

  it("test equals wrong type", () => {
    expect(parameters.equals("foo")).toBe(false);
  });

  it("test equals null", () => {
    expect(parameters.equals(null)).toBe(false);
  });

  it("test number returns undefined when key doesn't exist", () => {
    expect(new JobParameters().getNumber("keythatdoesntexist")).toBeUndefined();
  });

  it("test string returns undefined when key doesn't exist", () => {
    expect(new JobParameters().getString("keythatdoesntexist")).toBeUndefined();
  });

  it("test date returns undefined when key doesn't exist", () => {
    expect(new JobParameters().getDate("keythatdoesntexist")).toBeUndefined();
  });
});
