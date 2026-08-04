import type { Chunk } from "@nestjs-batch/infrastructure";
import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function AfterChunk(): StepListenerMethodDecorator<
  (chunk: Chunk<unknown>) => void
> {
  return createStepListenerDecorator("afterChunk");
}
