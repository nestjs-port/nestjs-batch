import type { ExitStatus } from "../exit-status.js";
import type { StepExecution } from "../step/step-execution.js";
import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function AfterStep(): StepListenerMethodDecorator<
  (stepExecution: StepExecution) => ExitStatus | null
> {
  return createStepListenerDecorator("afterStep");
}
