import type { Chunk } from "@nestjs-batch/infrastructure";
import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function BeforeChunk(): StepListenerMethodDecorator<
  (chunk: Chunk<unknown>) => void
> {
  return createStepListenerDecorator("beforeChunk");
}
