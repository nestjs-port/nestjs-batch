/**
 * Represents a single job parameter.
 */
export interface JobParameter<T = unknown> {
  /**
   * The name of the parameter.
   */
  readonly name: string;

  /**
   * The value of the parameter.
   */
  readonly value: T;

  /**
   * The type of the parameter.
   */
  readonly type: string;

  /**
   * Whether this parameter identifies the job instance.
   */
  readonly identifying: boolean;
}

/**
 * Creates a new job parameter.
 * @param name - the parameter name
 * @param value - the parameter value
 * @param type - the parameter type
 * @param identifying - whether this parameter identifies the job instance
 * @returns a new JobParameter
 */
export function createJobParameter<T>(
  name: string,
  value: T,
  type: string,
  identifying = true,
): JobParameter<T> {
  return {
    name,
    value,
    type,
    identifying,
  };
}
