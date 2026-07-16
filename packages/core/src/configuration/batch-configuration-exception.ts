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
 * Represents that an error has occurred in the configuration of the base batch
 * infrastructure (the creation of a
 * {@link org.springframework.batch.core.repository.JobRepository}, for example).
 */
export class BatchConfigurationException extends Error {
  /**
   * Create an exception with the given {@link Throwable}.
   * @param cause an exception to be wrapped
   */
  constructor(cause: unknown);
  /**
   * Create an exception with the given message.
   * @param message the error message
   */
  constructor(message: string);
  /**
   * Create an exception with the given message and {@link Throwable}.
   * @param message the error message
   * @param cause an exception to be wrapped
   */
  constructor(message: string, cause: unknown);
  constructor(messageOrCause: string | unknown, cause: unknown | null = null) {
    if (typeof messageOrCause === "string") {
      super(messageOrCause, cause != null ? { cause } : undefined);
      return;
    }

    super(
      messageOrCause instanceof Error
        ? messageOrCause.message
        : String(messageOrCause),
      {
        cause: messageOrCause,
      },
    );
  }
}
