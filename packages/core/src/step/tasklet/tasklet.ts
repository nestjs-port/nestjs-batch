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

import type { RepeatStatus } from "@nestjs-batch/infrastructure";
import type { ChunkContext } from "../../scope/index.js";
import type { StepContribution } from "../step-contribution.js";

/**
 * Strategy for processing in a step.
 */
export interface Tasklet {
  /**
   * Given the current context in the form of a step contribution, do whatever is
   * necessary to process this unit inside a transaction. Implementations return
   * {@link RepeatStatus.FINISHED} if finished. If not they return
   * {@link RepeatStatus.CONTINUABLE}. On failure throws an exception.
   *
   * @param contribution - mutable state to be passed back to update the current step execution
   * @param chunkContext - attributes shared between invocations but not between restarts
   * @returns an {@link RepeatStatus} indicating whether processing is continuable.
   *          Returning `null` is interpreted as {@link RepeatStatus.FINISHED}
   * @throws Error thrown if error occurs during execution.
   */
  execute(
    contribution: StepContribution,
    chunkContext: ChunkContext,
  ): Promise<RepeatStatus | null>;
}
