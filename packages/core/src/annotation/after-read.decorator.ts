import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function AfterRead(): StepListenerMethodDecorator<
  (item: unknown) => void
> {
  return createStepListenerDecorator("afterRead");
}
