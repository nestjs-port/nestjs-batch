import type { ChunkContext } from "../scope/context/chunk-context.js";
import {
  createStepListenerDecorator,
  type StepListenerMethodDecorator,
} from "./step-listener-decorator.js";

export function AfterChunkError(): StepListenerMethodDecorator<
  (context: ChunkContext) => void
> {
  return createStepListenerDecorator("afterChunkError");
}
