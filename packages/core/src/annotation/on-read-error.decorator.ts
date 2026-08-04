import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function OnReadError(): StepListenerMethodDecorator<
  (error: Error) => void
> {
  return createStepListenerDecorator("onReadError");
}
