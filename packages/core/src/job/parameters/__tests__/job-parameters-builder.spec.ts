import { describe, expect, it, beforeEach } from "vitest";

import { JobParameter } from "../job-parameter";
import { JobParameters } from "../job-parameters";
import { JobParametersBuilder } from "../job-parameters-builder";

describe("JobParametersBuilder", () => {
	let parametersBuilder: JobParametersBuilder;

	const date = new Date();

	beforeEach(() => {
		parametersBuilder = new JobParametersBuilder();
	});

	it("test adding null job parameters", () => {
		expect(() =>
			new JobParametersBuilder()
				.addString("foo", null as unknown as string)
				.toJobParameters(),
		).toThrow("Value for parameter 'foo' must not be null");
	});

	it("test non identifying parameters", () => {
		parametersBuilder.addDate("SCHEDULE_DATE", date, false);
		parametersBuilder.addNumber("NUMBER", 1, false);
		parametersBuilder.addString("STRING", "string value", false);
		parametersBuilder.addNumber("DOUBLE", 1.0, false);

		const parameters = parametersBuilder.toJobParameters();
		expect(parameters.getDate("SCHEDULE_DATE")).toEqual(date);
		expect(parameters.getNumber("NUMBER")).toBe(1);
		expect(parameters.getString("STRING")).toBe("string value");
		expect(parameters.getNumber("DOUBLE")).toBeCloseTo(1.0);
		expect(parameters.getParameter("SCHEDULE_DATE")?.identifying).toBe(false);
		expect(parameters.getParameter("NUMBER")?.identifying).toBe(false);
		expect(parameters.getParameter("STRING")?.identifying).toBe(false);
		expect(parameters.getParameter("DOUBLE")?.identifying).toBe(false);
	});

	it("test to job runtime parameters", () => {
		parametersBuilder.addDate("SCHEDULE_DATE", date);
		parametersBuilder.addNumber("NUMBER", 1);
		parametersBuilder.addString("STRING", "string value");
		parametersBuilder.addNumber("DOUBLE", 1.0);

		const parameters = parametersBuilder.toJobParameters();
		expect(parameters.getDate("SCHEDULE_DATE")).toEqual(date);
		expect(parameters.getNumber("NUMBER")).toBe(1);
		expect(parameters.getNumber("DOUBLE")).toBeCloseTo(1.0);
		expect(parameters.getString("STRING")).toBe("string value");
	});

	it("test copy", () => {
		parametersBuilder.addString("STRING", "string value");
		parametersBuilder = new JobParametersBuilder(
			parametersBuilder.toJobParameters(),
		);

		const names: string[] = [];
		for (const param of parametersBuilder.toJobParameters()) {
			names.push(param.name);
		}
		expect(names).toContain("STRING");
	});

	it("test add job parameter", () => {
		const jobParameter = new JobParameter("name", "bar", String);
		parametersBuilder.addJobParameter(jobParameter);

		const parameters = parametersBuilder.toJobParameters();
		expect(parameters.size).toBe(1);

		const param = parameters.getParameter("name");
		expect(param?.name).toBe("name");
		expect(param?.value).toBe("bar");
		expect(param?.identifying).toBe(true);
	});

	it("test add job parameter with name value type", () => {
		parametersBuilder.addJobParameter("key", "value", String);

		const parameters = parametersBuilder.toJobParameters();
		expect(parameters.size).toBe(1);

		const param = parameters.getParameter("key");
		expect(param?.name).toBe("key");
		expect(param?.value).toBe("value");
		expect(param?.identifying).toBe(true);
	});

	it("test add job parameters copies all", () => {
		const existing = new JobParameters(
			new Map<string, JobParameter>([
				["a", new JobParameter("a", "1", String, true)],
				["b", new JobParameter("b", "2", String, true)],
			]),
		);

		parametersBuilder.addJobParameters(existing);
		const parameters = parametersBuilder.toJobParameters();
		expect(parameters.size).toBe(2);
		expect(parameters.getString("a")).toBe("1");
		expect(parameters.getString("b")).toBe("2");
	});

	it("test replacing parameter with same name", () => {
		parametersBuilder.addString("key", "first");
		parametersBuilder.addString("key", "second");

		const parameters = parametersBuilder.toJobParameters();
		expect(parameters.size).toBe(1);
		expect(parameters.getString("key")).toBe("second");
	});
});
