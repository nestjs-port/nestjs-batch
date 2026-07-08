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

import type { RepeatContext } from "../repeat-context.js";
import { type Logger, LoggerFactory } from "@nestjs-port/core";
import type { ExceptionHandler } from "./exception-handler.js";

/**
 * Implementation of {@link ExceptionHandler} based on an {@link Classifier}. The
 * classifier determines whether to log the exception or rethrow it. The keys in the
 * classifier must be the same as the static enum in this class.
 *
 * Logging levels for the handler.
 */
export enum LogOrRethrowExceptionHandlerLevel {
  /**
   * Key for {@link Classifier} signalling that the throwable should be rethrown.
   * If the throwable is not a RuntimeException it is wrapped in a
   * RepeatException.
   */
  RETHROW = "RETHROW",
  /**
   * Key for {@link Classifier} signalling that the throwable should be logged at
   * debug level.
   */
  DEBUG = "DEBUG",
  /**
   * Key for {@link Classifier} signalling that the throwable should be logged at
   * warn level.
   */
  WARN = "WARN",
  /**
   * Key for {@link Classifier} signalling that the throwable should be logged at
   * error level.
   */
  ERROR = "ERROR",
}

export type LogOrRethrowExceptionClassifier = (
  throwable: unknown,
) => LogOrRethrowExceptionHandlerLevel;

export class LogOrRethrowExceptionHandler implements ExceptionHandler {
  private readonly _logger: Logger = LoggerFactory.getLogger(
    LogOrRethrowExceptionHandler.name,
  );
  private _exceptionClassifier: LogOrRethrowExceptionClassifier = () =>
    LogOrRethrowExceptionHandlerLevel.RETHROW;

  /**
   * Setter for the {@link Classifier} used by this handler. The default is to map all
   * throwable instances to {@link LogOrRethrowExceptionHandlerLevel#RETHROW}.
   * @param exceptionClassifier the ExceptionClassifier to use
   */
  setExceptionClassifier(
    exceptionClassifier: LogOrRethrowExceptionClassifier,
  ): void {
    this._exceptionClassifier = exceptionClassifier;
  }

  /**
   * Classify the throwables and decide whether to rethrow based on the result. The
   * context is not used.
   * @throws Throwable thrown if
   * {@link LogOrRethrowExceptionHandler#exceptionClassifier} is classified as
   * {@link LogOrRethrowExceptionHandlerLevel#RETHROW}.
   * @see ExceptionHandler#handleException(RepeatContext, Throwable)
   */
  handleException(_context: RepeatContext, throwable: unknown): void {
    const key = this._exceptionClassifier(throwable);

    if (key === LogOrRethrowExceptionHandlerLevel.ERROR) {
      this._logger.error(`Exception encountered in batch repeat.`, throwable);
    } else if (key === LogOrRethrowExceptionHandlerLevel.WARN) {
      this._logger.warn(`Exception encountered in batch repeat.`, throwable);
    } else if (
      key === LogOrRethrowExceptionHandlerLevel.DEBUG &&
      this._logger.isDebugEnabled()
    ) {
      this._logger.debug(`Exception encountered in batch repeat.`, throwable);
    } else if (key === LogOrRethrowExceptionHandlerLevel.RETHROW) {
      throw throwable;
    }
  }
}
