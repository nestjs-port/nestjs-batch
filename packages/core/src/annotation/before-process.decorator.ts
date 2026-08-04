import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function BeforeProcess(): StepListenerMethodDecorator<
  (item: unknown) => void
> {
  return createStepListenerDecorator("beforeProcess");
}
