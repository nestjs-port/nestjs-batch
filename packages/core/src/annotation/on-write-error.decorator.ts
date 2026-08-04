import type { Chunk } from "@nestjs-batch/infrastructure";
import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function OnWriteError(): StepListenerMethodDecorator<
  (error: Error, items: Chunk<unknown>) => void
> {
  return createStepListenerDecorator("onWriteError");
}
