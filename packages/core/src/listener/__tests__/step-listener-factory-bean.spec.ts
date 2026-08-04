/*
 * Copyright 2002-present the original author or authors.
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

import { describe, expect, it } from "vitest";
import type { Chunk } from "@nestjs-batch/infrastructure";

import {
  AfterChunk,
  AfterChunkError,
  AfterProcess,
  AfterRead,
  AfterStep,
  AfterWrite,
  BeforeChunk,
  BeforeProcess,
  BeforeRead,
  BeforeStep,
  BeforeWrite,
  OnProcessError,
  OnReadError,
  OnSkipInProcess,
  OnSkipInRead,
  OnSkipInWrite,
  OnWriteError,
} from "../../annotation/index.js";
import { StepListenerFactoryBean } from "../step-listener-factory-bean.js";
import type { ChunkContext } from "../../scope/context/chunk-context.js";
import type { StepExecution } from "../../step/step-execution.js";

describe("StepListenerFactoryBean", () => {
  it("test step and chunk", () => {
    const delegate = new TestListener();
    const listener = StepListenerFactoryBean.getListener(delegate);
    const chunk = {} as Chunk<unknown>;
    const callback = listener as StepListenerCallbacks;

    callback.beforeStep({});
    callback.afterStep({});
    callback.beforeChunk(chunk);
    callback.afterChunk(chunk);
    callback.afterChunkError({} as ChunkContext);
    callback.beforeRead();
    callback.afterRead("item");
    callback.onReadError(new Error());
    callback.beforeProcess("item");
    callback.afterProcess("item", 2);
    callback.onProcessError("item", new Error());
    callback.beforeWrite(chunk);
    callback.afterWrite(chunk);
    callback.onWriteError(new Error(), chunk);
    callback.onSkipInRead(new Error());
    callback.onSkipInProcess("item", new Error());
    callback.onSkipInWrite(2, new Error());

    expect(Object.values(delegate.called).every(Boolean)).toBe(true);
  });

  it("test vanilla interface", () => {
    const delegate = new InterfaceListener();
    const listener = StepListenerFactoryBean.getListener(
      delegate,
    ) as StepListenerCallbacks;

    expect(StepListenerFactoryBean.isListener(delegate)).toBe(true);
    listener.beforeStep({});
    expect(delegate.callCount).toBe(1);
  });

  it("test vanilla interface with proxy", () => {
    const delegate = new InterfaceListener();
    const proxy = new Proxy(delegate, {});
    const listener = StepListenerFactoryBean.getListener(
      proxy,
    ) as StepListenerCallbacks;

    expect(StepListenerFactoryBean.isListener(listener)).toBe(true);
    listener.beforeStep({});
    expect(delegate.callCount).toBe(1);
  });

  it("test annotations is listener", () => {
    expect(StepListenerFactoryBean.isListener(new TestListener())).toBe(true);
  });

  it("test non-listener", () => {
    const delegate = {};

    expect(StepListenerFactoryBean.isListener(delegate)).toBe(false);
    expect(StepListenerFactoryBean.getListener(delegate)).toBe(delegate);
  });
});

class InterfaceListener {
  callCount = 0;

  beforeStep(): void {
    this.callCount++;
  }
}

interface StepListenerCallbacks {
  beforeStep(execution: unknown): void;
  afterStep(execution: unknown): unknown;
  beforeChunk(chunk: Chunk<unknown>): void;
  afterChunk(chunk: Chunk<unknown>): void;
  afterChunkError(context: ChunkContext): void;
  beforeRead(): void;
  afterRead(item: unknown): void;
  onReadError(error: Error): void;
  beforeProcess(item: unknown): void;
  afterProcess(item: unknown, result: unknown): void;
  onProcessError(item: unknown, error: Error): void;
  beforeWrite(items: Chunk<unknown>): void;
  afterWrite(items: Chunk<unknown>): void;
  onWriteError(error: Error, items: Chunk<unknown>): void;
  onSkipInRead(error: Error): void;
  onSkipInProcess(item: unknown, error: Error): void;
  onSkipInWrite(item: unknown, error: Error): void;
}

class TestListener {
  called = {
    beforeStep: false,
    afterStep: false,
    beforeChunk: false,
    afterChunk: false,
    afterChunkError: false,
    beforeRead: false,
    afterRead: false,
    onReadError: false,
    beforeProcess: false,
    afterProcess: false,
    onProcessError: false,
    beforeWrite: false,
    afterWrite: false,
    onWriteError: false,
    onSkipInRead: false,
    onSkipInProcess: false,
    onSkipInWrite: false,
  };

  @BeforeStep()
  beforeStep(_execution: StepExecution): void {
    this.called.beforeStep = true;
  }

  @AfterStep()
  afterStep(_execution: StepExecution): null {
    this.called.afterStep = true;
    return null;
  }

  @BeforeChunk()
  beforeChunk(_chunk: Chunk<unknown>): void {
    this.called.beforeChunk = true;
  }

  @AfterChunk()
  afterChunk(_chunk: Chunk<unknown>): void {
    this.called.afterChunk = true;
  }

  @AfterChunkError()
  afterChunkError(_context: ChunkContext): void {
    this.called.afterChunkError = true;
  }

  @BeforeRead()
  beforeRead(): void {
    this.called.beforeRead = true;
  }

  @AfterRead()
  afterRead(_item: unknown): void {
    this.called.afterRead = true;
  }

  @OnReadError()
  onReadError(_error: Error): void {
    this.called.onReadError = true;
  }

  @BeforeProcess()
  beforeProcess(_item: unknown): void {
    this.called.beforeProcess = true;
  }

  @AfterProcess()
  afterProcess(_item: unknown, _result: unknown): void {
    this.called.afterProcess = true;
  }

  @OnProcessError()
  onProcessError(_item: unknown, _error: Error): void {
    this.called.onProcessError = true;
  }

  @BeforeWrite()
  beforeWrite(_items: Chunk<unknown>): void {
    this.called.beforeWrite = true;
  }

  @AfterWrite()
  afterWrite(_items: Chunk<unknown>): void {
    this.called.afterWrite = true;
  }

  @OnWriteError()
  onWriteError(_error: Error, _items: Chunk<unknown>): void {
    this.called.onWriteError = true;
  }

  @OnSkipInRead()
  onSkipInRead(_error: Error): void {
    this.called.onSkipInRead = true;
  }

  @OnSkipInProcess()
  onSkipInProcess(_item: unknown, _error: Error): void {
    this.called.onSkipInProcess = true;
  }

  @OnSkipInWrite()
  onSkipInWrite(_item: unknown, _error: Error): void {
    this.called.onSkipInWrite = true;
  }
}
