import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function BeforeRead(): StepListenerMethodDecorator<() => void> {
  return createStepListenerDecorator("beforeRead");
}
