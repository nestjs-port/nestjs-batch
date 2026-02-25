import type { AttributeAccessor } from "@nestjs-batch/commons";

export interface RepeatContext extends AttributeAccessor {

  get parent(): RepeatContext | null;

  get startedCount(): number;

  setCompleteOnly(): void;

  get isCompleteOnly(): boolean;

  setTerminateOnly(): void;

  get isTerminateOnly(): boolean;

  registerDestructionCallback(name: string, callback: () => void): void;

  close(): void;
}
