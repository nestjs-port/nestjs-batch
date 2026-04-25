import type { RepeatContext } from "./repeat-context.js";
import type { RepeatStatus } from "./repeat-status.js";

export interface RepeatListener {
  before?(context: RepeatContext): void;

  after?(context: RepeatContext, result: RepeatStatus): void;

  open?(context: RepeatContext): void;

  onError?(context: RepeatContext, error: unknown): void;

  close?(context: RepeatContext): void;
}
