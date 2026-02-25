import type { RepeatCallback } from './repeat-callback';
// import type { RepeatException } from './exception/repeat-exception';
import type { RepeatStatus } from './repeat-status';

export interface RepeatOperations {
  iterate(callback: RepeatCallback): RepeatStatus;
}
