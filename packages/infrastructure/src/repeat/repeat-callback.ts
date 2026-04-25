import type { RepeatContext } from "./repeat-context.js";
import type { RepeatStatus } from "./repeat-status.js";

export interface RepeatCallback {
  doInIteration(context: RepeatContext): RepeatStatus;
}
