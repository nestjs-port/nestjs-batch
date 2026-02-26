import type { RepeatStatus } from "@nestjs-batch/infrastructure";
import type { ChunkContext } from "../../scope";
import type { StepContribution } from "../step-contribution";

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
