export interface RepeatContext {
  setAttribute(name: string, value: unknown): void;

  getAttribute(name: string): unknown;

  removeAttribute(name: string): unknown;

  hasAttribute(name: string): boolean;

  attributeNames(): string[];

  get parent(): RepeatContext | null;

  get startedCount(): number;

  setCompleteOnly(): void;

  get isCompleteOnly(): boolean;

  setTerminateOnly(): void;

  get isTerminateOnly(): boolean;

  registerDestructionCallback(name: string, callback: () => void): void;

  close(): void;
}
