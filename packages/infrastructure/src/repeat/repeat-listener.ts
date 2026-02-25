import type { RepeatContext } from './context/repeat-context';
import type { RepeatStatus } from './repeat-status';

export interface RepeatListener {
  before?(context: RepeatContext): void;

  after?(context: RepeatContext, result: RepeatStatus): void;

  open?(context: RepeatContext): void;

  onError?(context: RepeatContext, error: unknown): void;

  close?(context: RepeatContext): void;
}
