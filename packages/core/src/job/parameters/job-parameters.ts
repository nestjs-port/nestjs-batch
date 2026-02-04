import type { JobParameter } from './job-parameter';

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

  /**
   * Returns an iterator for the parameters.
   */
  [Symbol.iterator](): Iterator<JobParameter> {
    return this._parameters.values();
  }

  /**
   * Converts to a plain object.
   * @returns object with parameter values
   */
  toObject(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [name, param] of this._parameters) {
      result[name] = param.value;
    }
    return result;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }
}
