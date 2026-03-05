import type { StepContext } from "./step-context";

/**
 * Context object for weakly typed data stored for the duration of a chunk
 * (usually a group of items processed together in a transaction).
 * If there is a rollback and the chunk is retried the same context will be
 * associated with it.
 */
export class ChunkContext {
  private readonly _stepContext: StepContext;
  private readonly _attributes: Map<string, unknown> = new Map();
  private _complete = false;

  /**
   * Creates a new ChunkContext.
   * @param stepContext - the current step context
   */
  constructor(stepContext: StepContext) {
    this._stepContext = stepContext;
  }

  /**
   * Gets the current step context.
   * @returns the current step context
   */
  get stepContext(): StepContext {
    return this._stepContext;
  }

  /**
   * Checks if there is no more processing to be done on this chunk.
   * @returns true if the chunk is complete
   */
  get isComplete(): boolean {
    return this._complete;
  }

  /**
   * Marks this chunk as complete.
   */
  setComplete(): void {
    this._complete = true;
  }

  /**
   * Sets an attribute on this context.
   * @param name - the attribute name
   * @param value - the attribute value
   */
  setAttribute(name: string, value: unknown): void {
    this._attributes.set(name, value);
  }

  /**
   * Gets an attribute from this context.
   * @param name - the attribute name
   * @returns the attribute value or null
   */
  getAttribute(name: string): unknown | null {
    return this._attributes.get(name) ?? null;
  }

  /**
   * Removes an attribute from this context.
   * @param name - the attribute name
   * @returns the removed value or null
   */
  removeAttribute(name: string): unknown | null {
    const value = this._attributes.get(name);
    this._attributes.delete(name);
    return value ?? null;
  }

  /**
   * Gets all attribute names.
   * @returns array of attribute names
   */
  attributeNames(): string[] {
    return Array.from(this._attributes.keys());
  }

  toString(): string {
    return `ChunkContext: attributes=[${this.attributeNames().join(", ")}], complete=${this._complete}, stepContext=${this._stepContext}`;
  }
}
