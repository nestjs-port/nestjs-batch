import { describe, it, expect, vi, beforeEach } from "vitest";

import { CompositeJobParametersValidator } from "../composite-job-parameters-validator";
import { JobParameters } from "../job-parameters";
import type { JobParametersValidator } from "../job-parameters-validator";

describe("CompositeJobParametersValidator", () => {
	let compositeValidator: CompositeJobParametersValidator;
	const parameters = new JobParameters();

	beforeEach(() => {
		compositeValidator = new CompositeJobParametersValidator();
	});

	it("should throw when validators are not set", () => {
		expect(() => compositeValidator.afterPropertiesSet()).toThrow(
			"The 'validators' may not be empty",
		);
	});

	it("should throw when validators are empty", () => {
		compositeValidator.validators = [];
		expect(() => compositeValidator.afterPropertiesSet()).toThrow(
			"The 'validators' may not be empty",
		);
	});

	it("should invoke delegate validator", () => {
		const mockValidator: JobParametersValidator = {
			validate: vi.fn(),
		};
		compositeValidator.validators = [mockValidator];
		compositeValidator.validate(parameters);

		expect(mockValidator.validate).toHaveBeenCalledWith(parameters);
	});

	it("should invoke all delegate validators", () => {
		const mockValidator1: JobParametersValidator = {
			validate: vi.fn(),
		};
		const mockValidator2: JobParametersValidator = {
			validate: vi.fn(),
		};
		compositeValidator.validators = [mockValidator1, mockValidator2];
		compositeValidator.validate(parameters);

		expect(mockValidator1.validate).toHaveBeenCalledWith(parameters);
		expect(mockValidator2.validate).toHaveBeenCalledWith(parameters);
	});
});