import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function OnSkipInRead(): StepListenerMethodDecorator<
  (error: Error) => void
> {
  return createStepListenerDecorator("onSkipInRead");
}
