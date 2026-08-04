import type { StepExecution } from "../step/step-execution.js";
import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function BeforeStep(): StepListenerMethodDecorator<
  (stepExecution: StepExecution) => void
> {
  return createStepListenerDecorator("beforeStep");
}
