/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { StepExecution } from "../../step/index.js";

/**
 * A context object that can be used to interrogate the current StepExecution and
 * some of its associated properties. Has public getters for the step execution
 * and convenience methods for accessing commonly used properties like the
 * ExecutionContext associated with the step or its enclosing job execution.
 */
export class StepContext {
  private readonly _stepExecution: StepExecution;
  private readonly _attributes: Map<string, unknown> = new Map();
  private readonly _callbacks: Map<string, Set<() => void>> = new Map();

  /**
   * Create a new instance of StepContext for this StepExecution.
   * @param stepExecution - a step execution
   */
  constructor(stepExecution: StepExecution) {
    if (!stepExecution) {
      throw new Error("A StepContext must have a non-null StepExecution");
    }
    this._stepExecution = stepExecution;
  }

  /**
   * Convenient accessor for current step name identifier.
   * @returns the step name identifier of the current StepExecution
   */
  get stepName(): string {
    return this._stepExecution.stepName;
  }

  /**
   * Convenient accessor for current job name identifier.
   * @returns the job name identifier
   */
  get jobName(): string {
    return this._stepExecution.jobExecution.jobInstance.jobName;
  }

  /**
   * Convenient accessor for current JobInstance identifier.
   * @returns the identifier of the enclosing JobInstance
   */
  get jobInstanceId(): number | null {
    return this._stepExecution.jobExecution.jobInstance.instanceId;
  }

  /**
   * Gets the step execution context as a map.
   * @returns a map containing the items from the step ExecutionContext
   */
  get stepExecutionContext(): Map<string, unknown> {
    return this._stepExecution.executionContext.toMap();
  }

  /**
   * Gets the job execution context as a map.
   * @returns a map containing the items from the job ExecutionContext
   */
  get jobExecutionContext(): Map<string, unknown> {
    return this._stepExecution.jobExecution.executionContext.toMap();
  }

  /**
   * Gets the job parameters as a map.
   * @returns a map containing the items from the JobParameters
   */
  get jobParameters(): Map<string, unknown> {
    const result = new Map<string, unknown>();
    for (const param of this._stepExecution.jobParameters) {
      result.set(param.name, param.value);
    }
    return result;
  }

  /**
   * Allow clients to register callbacks for clean up on close.
   * @param name - the callback id
   * @param callback - a callback to execute on close
   */
  registerDestructionCallback(name: string, callback: () => void): void {
    let set = this._callbacks.get(name);
    if (!set) {
      set = new Set();
      this._callbacks.set(name, set);
    }
    set.add(callback);
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
    this._callbacks.delete(name);
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

  /**
   * Clean up the context at the end of a step execution.
   */
  close(): void {
    const errors: Error[] = [];

    for (const [, callbackSet] of this._callbacks) {
      for (const callback of callbackSet) {
        try {
          callback();
        } catch (error) {
          if (error instanceof Error) {
            errors.push(error);
          }
        }
      }
    }

    if (errors.length > 0) {
      throw errors[0];
    }
  }

  /**
   * The current StepExecution that is active in this context.
   * @returns the current StepExecution
   */
  get stepExecution(): StepExecution {
    return this._stepExecution;
  }

  /**
   * Gets a unique identifier for this context.
   * @returns unique identifier based on the step execution
   */
  get id(): string {
    return `execution#${this._stepExecution.id}`;
  }

  toString(): string {
    return `StepContext: stepExecutionContext=${JSON.stringify(Object.fromEntries(this.stepExecutionContext))}, jobExecutionContext=${JSON.stringify(Object.fromEntries(this.jobExecutionContext))}, jobParameters=${JSON.stringify(Object.fromEntries(this.jobParameters))}`;
  }
}
