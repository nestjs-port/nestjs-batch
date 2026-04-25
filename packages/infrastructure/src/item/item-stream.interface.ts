import type { ExecutionContext } from "./execution-context.js";

export interface ItemStream {
  open?(executionContext: ExecutionContext): void;

  update?(executionContext: ExecutionContext): void;

  close?(): void;
}
