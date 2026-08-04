import type { Chunk } from "@nestjs-batch/infrastructure";
import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function BeforeWrite(): StepListenerMethodDecorator<
  (items: Chunk<unknown>) => void
> {
  return createStepListenerDecorator("beforeWrite");
}
