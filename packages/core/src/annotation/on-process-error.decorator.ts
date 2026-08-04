import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function OnProcessError(): StepListenerMethodDecorator<
  (item: unknown, error: Error) => void
> {
  return createStepListenerDecorator("onProcessError");
}
