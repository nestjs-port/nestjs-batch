import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function OnSkipInProcess(): StepListenerMethodDecorator<
  (item: unknown, error: Error) => void
> {
  return createStepListenerDecorator("onSkipInProcess");
}
