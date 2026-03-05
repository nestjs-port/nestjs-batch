/**
 * Interface that defines contract of incrementing any data store field's
 * maximum value. Works much like a sequence number generator.
 *
 * Typical implementations may use standard SQL, native RDBMS sequences
 * or Stored Procedures to do the job.
 */
export interface DataFieldMaxValueIncrementer {
  /**
   * Increment the data store field's max value as int.
   *
   * @returns int next data store value such as max + 1
   * @throws DataAccessException in case of errors
   */
  nextIntValue(): number;

  /**
   * Increment the data store field's max value as long.
   *
   * @returns int next data store value such as max + 1
   * @throws DataAccessException in case of errors
   */
  nextLongValue(): number;

  /**
   * Increment the data store field's max value as String.
   *
   * @returns next data store value such as max + 1
   * @throws DataAccessException in case of errors
   */
  nextStringValue(): string;
}
