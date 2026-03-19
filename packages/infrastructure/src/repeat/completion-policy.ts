import type { RepeatContext } from "./repeat-context.js";
import type { RepeatStatus } from "./repeat-status";

export interface CompletionPolicy {
  isComplete(context: RepeatContext, result: RepeatStatus): boolean;

  isComplete(context: RepeatContext): boolean;

  start(parent: RepeatContext): RepeatContext;

  update(context: RepeatContext): void;
}
