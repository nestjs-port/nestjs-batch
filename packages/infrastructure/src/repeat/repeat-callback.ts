import type { RepeatContext } from "./context/repeat-context";
import type { RepeatStatus } from "./repeat-status";

export interface RepeatCallback {
  doInIteration(context: RepeatContext): RepeatStatus;
}
