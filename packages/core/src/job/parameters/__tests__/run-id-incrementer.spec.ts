import { describe, expect, it } from "vitest";

import { JobParameters } from "../job-parameters";
import { JobParametersBuilder } from "../job-parameters-builder";
import { RunIdIncrementer } from "../run-id-incrementer";

describe("RunIdIncrementer", () => {
  const incrementer = new RunIdIncrementer();

  it("test get next", () => {
    const next = incrementer.getNext(new JobParameters());
    expect(next.getNumber("run.id")).toBe(1);
    const nextNext = incrementer.getNext(next);
    expect(nextNext.getNumber("run.id")).toBe(2);
  });

  it("test get next appends", () => {
    const jobParameters = new JobParametersBuilder()
      .addString("foo", "bar")
      .toJobParameters();
    const next = incrementer.getNext(jobParameters);
    expect(next.getNumber("run.id")).toBe(1);
    expect(next.getString("foo")).toBe("bar");
  });

  it("test get next named", () => {
    const namedIncrementer = new RunIdIncrementer();
    namedIncrementer.key = "foo";
    const next = namedIncrementer.getNext(new JobParameters());
    expect(next.getNumber("foo")).toBe(1);
  });

  it("test get next when run id is string", () => {
    // given
    const parameters = new JobParametersBuilder()
      .addString("run.id", "5")
      .toJobParameters();

    // when
    const next = incrementer.getNext(parameters);

    // then
    expect(next.getNumber("run.id")).toBe(6);
  });

  it("test get next when run id is invalid string", () => {
    const jobParameters = new JobParametersBuilder()
      .addString("run.id", "foo")
      .toJobParameters();
    expect(() => incrementer.getNext(jobParameters)).toThrow();
  });
});
