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

import { beforeEach, describe, expect, it } from "vitest";

import {
  LogOrRethrowExceptionHandler,
  LogOrRethrowExceptionHandlerLevel,
} from "../log-or-rethrow-exception-handler.js";
import { LoggerFactory, LogLevel } from "@nestjs-port/core";
import { RecordingLogger } from "@nestjs-port/testing";

describe("LogOrRethrowExceptionHandler", () => {
  let recordingLogger: RecordingLogger;

  beforeEach(() => {
    recordingLogger = new RecordingLogger("LogOrRethrowExceptionHandler");
    LoggerFactory.bind({
      getLogger: () => recordingLogger,
    });
  });

  it("test runtime exception", () => {
    const handler = new LogOrRethrowExceptionHandler();

    expect(() =>
      handler.handleException(null as never, new RuntimeException("Foo")),
    ).toThrow("Foo");
  });

  it("test error", () => {
    const handler = new LogOrRethrowExceptionHandler();

    expect(() =>
      handler.handleException(null as never, new Error("Foo")),
    ).toThrow("Foo");
  });

  it("test not rethrown error level", () => {
    const handler = new LogOrRethrowExceptionHandler();
    handler.setExceptionClassifier(
      () => LogOrRethrowExceptionHandlerLevel.ERROR,
    );

    // No exception...
    handler.handleException(null as never, new Error("Foo"));

    expect(recordingLogger.entries).toHaveLength(1);
    expect(recordingLogger.entries[0]).toMatchObject({
      level: LogLevel.ERROR,
      message: "Exception encountered in batch repeat.",
      args: [new Error("Foo")],
    });
  });

  it("test not rethrown warn level", () => {
    const handler = new LogOrRethrowExceptionHandler();
    handler.setExceptionClassifier(
      () => LogOrRethrowExceptionHandlerLevel.WARN,
    );

    // No exception...
    handler.handleException(null as never, new Error("Foo"));

    expect(recordingLogger.entries).toHaveLength(1);
    expect(recordingLogger.entries[0]).toMatchObject({
      level: LogLevel.WARN,
      message: "Exception encountered in batch repeat.",
      args: [new Error("Foo")],
    });
  });

  it("test not rethrown debug level", () => {
    const handler = new LogOrRethrowExceptionHandler();
    handler.setExceptionClassifier(
      () => LogOrRethrowExceptionHandlerLevel.DEBUG,
    );

    // No exception...
    handler.handleException(null as never, new Error("Foo"));

    expect(recordingLogger.entries).toHaveLength(1);
    expect(recordingLogger.entries[0]).toMatchObject({
      level: LogLevel.DEBUG,
      message: "Exception encountered in batch repeat.",
      args: [new Error("Foo")],
    });
  });
});

class RuntimeException extends Error {}
