import type { JobParameter } from "./job-parameter";

/**
 * Value object representing runtime parameters to a batch job.
 * JobParameters is immutable.
 */
export class JobParameters implements Iterable<JobParameter> {
  private readonly _parameters: Map<string, JobParameter>;

  /**
   * Creates a new JobParameters.
   * @param parameters - map of parameter name to JobParameter
   */
  constructor(parameters?: Map<string, JobParameter>) {
    this._parameters = new Map(parameters ?? []);
  }

  /**
   * Gets a parameter by name.
   * @param name - the parameter name
   * @returns the JobParameter or undefined
   */
  getParameter(name: string): JobParameter | undefined {
    return this._parameters.get(name);
  }

  /**
   * Gets a parameter value by name.
   * @param name - the parameter name
   * @returns the parameter value or undefined
   */
  getValue<T = unknown>(name: string): T | undefined {
    return this._parameters.get(name)?.value as T | undefined;
  }

  /**
   * Gets all parameter names.
   * @returns array of parameter names
   */
  get names(): string[] {
    return Array.from(this._parameters.keys());
  }

  /**
   * Checks if the parameters are empty.
   * @returns true if empty
   */
  get isEmpty(): boolean {
    return this._parameters.size === 0;
  }

  /**
   * Gets the number of parameters.
   * @returns the size
   */
  get size(): number {
    return this._parameters.size;
  }

  getNumber(key: string): number | undefined;
  getNumber(key: string, defaultValue: number): number;
  getNumber(key: string, defaultValue?: number): number | undefined {
    const param = this.getParameter(key);
    if (param == null) return defaultValue;
    if (param.type !== Number) {
      throw new Error(`Key ${key} is not of type Number`);
    }
    return param.value as number;
  }

  getString(key: string): string | undefined;
  getString(key: string, defaultValue: string): string;
  getString(key: string, defaultValue?: string): string | undefined {
    const param = this.getParameter(key);
    if (param == null) return defaultValue;
    if (param.type !== String) {
      throw new Error(`Key ${key} is not of type String`);
    }
    return param.value as string;
  }

  getDate(key: string): Date | undefined;
  getDate(key: string, defaultValue: Date): Date;
  getDate(key: string, defaultValue?: Date): Date | undefined {
    const param = this.getParameter(key);
    if (param == null) return defaultValue;
    if (param.type !== Date) {
      throw new Error(`Key ${key} is not of type Date`);
    }
    return param.value as Date;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof JobParameters)) return false;
    if (this._parameters.size !== other._parameters.size) return false;
    for (const [key, param] of this._parameters) {
      const otherParam = other._parameters.get(key);
      if (otherParam == null || !param.equals(otherParam)) return false;
    }
    return true;
  }

  /**
   * Returns an iterator for the parameters.
   */
  [Symbol.iterator](): Iterator<JobParameter> {
    return this._parameters.values();
  }
}
