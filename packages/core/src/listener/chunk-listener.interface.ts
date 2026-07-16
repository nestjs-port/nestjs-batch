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

import type { Chunk } from "@nestjs-batch/infrastructure";

import type { ChunkContext } from "../scope/context/chunk-context.js";
import type { StepListener } from "./step-listener.js";

/** Listener interface for the lifecycle of a chunk. */
export interface ChunkListener<I, O> extends StepListener {
  /** Callback before the chunk is executed. */
  beforeChunk?(context: ChunkContext): void;
  /** Callback after the chunk is executed. */
  afterChunk?(context: ChunkContext): void;
  /** Callback after a chunk has been marked for rollback. */
  afterChunkError?(context: ChunkContext): void;
  /** Callback after a chunk is read but before it is processed. */
  beforeChunk?(chunk: Chunk<I>): void;
  /** Callback after the chunk is written. */
  afterChunk?(chunk: Chunk<O>): void;
  /** Callback if an exception occurs while processing or writing a chunk. */
  onChunkError?(exception: Error, chunk: Chunk<O>): void;
}

/** The key for retrieving the rollback exception. */
export const CHUNK_LISTENER_ROLLBACK_EXCEPTION_KEY = "sb_rollback_exception";
