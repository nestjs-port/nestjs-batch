import type { RepeatCallback } from "./repeat-callback.js";
import type { RepeatStatus } from "./repeat-status.js";

export interface RepeatOperations {
  /**
   * @throws RepeatException
   */
  iterate(callback: RepeatCallback): RepeatStatus;
}
