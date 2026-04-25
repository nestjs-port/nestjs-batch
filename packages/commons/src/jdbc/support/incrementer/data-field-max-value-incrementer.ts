/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
