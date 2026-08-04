import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function OnSkipInWrite(): StepListenerMethodDecorator<
  (item: unknown, error: Error) => void
> {
  return createStepListenerDecorator("onSkipInWrite");
}
