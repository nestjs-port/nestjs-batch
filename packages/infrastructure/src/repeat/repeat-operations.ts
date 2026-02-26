import type { RepeatCallback } from "./repeat-callback";
import type { RepeatStatus } from "./repeat-status";

export interface RepeatOperations {
  /**
   * @throws RepeatException
   */
  iterate(callback: RepeatCallback): RepeatStatus;
}
