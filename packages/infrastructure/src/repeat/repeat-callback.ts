import type { RepeatContext } from "./repeat-context.js";
import type { RepeatStatus } from "./repeat-status";

export interface RepeatCallback {
  doInIteration(context: RepeatContext): RepeatStatus;
}
