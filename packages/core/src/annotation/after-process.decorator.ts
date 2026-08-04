import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function AfterProcess(): StepListenerMethodDecorator<
  (item: unknown, result: unknown) => void
> {
  return createStepListenerDecorator("afterProcess");
}
