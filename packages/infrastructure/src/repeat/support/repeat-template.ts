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

import type { CompletionPolicy } from "../completion-policy.js";
import { type Logger, LoggerFactory } from "@nestjs-port/core";
import type { RepeatCallback } from "../repeat-callback.js";
import type { RepeatContext } from "../repeat-context.js";
import type { RepeatListener } from "../repeat-listener.js";
import type { RepeatOperations } from "../repeat-operations.js";
import { RepeatStatus } from "../repeat-status.js";
import { DefaultExceptionHandler } from "../exception/default-exception-handler.js";
import type { ExceptionHandler } from "../exception/exception-handler.js";
import { DefaultResultCompletionPolicy } from "../policy/default-result-completion-policy.js";
import { RepeatInternalStateSupport } from "./repeat-internal-state-support.js";
import type { RepeatInternalState } from "./repeat-internal-state.js";
import { RepeatSynchronizationManager } from "./repeat-synchronization-manager.js";

/**
 * Simple implementation and base class for batch templates implementing
 * {@link RepeatOperations}. Provides a framework including interceptors and policies.
 * Subclasses just need to provide a method that gets the next result and one that waits
 * for all the results to be returned from concurrent processes or threads.
 *
 * N.B. the template accumulates thrown exceptions during the iteration, and they are all
 * processed together when the main loop ends (i.e. finished processing the items).
 * Clients that do not want to stop execution when an exception is thrown can use a
 * specific {@link CompletionPolicy} that does not finish when exceptions are received.
 * This is not the default behaviour.
 *
 * Clients that want to take some business action when an exception is thrown by the
 * {@link RepeatCallback} can consider using a custom {@link RepeatListener} instead of
 * trying to customise the {@link CompletionPolicy}. This is generally a friendlier
 * interface to implement, and the {@link RepeatListener#after} method is passed in the
 * result of the callback, which would be an instance of {@link Throwable} if the business
 * processing had thrown an exception. If the exception is not to be propagated to the
 * caller, then a non-default {@link CompletionPolicy} needs to be provided as well, but
 * that could be off the shelf, with the business action implemented only in the
 * interceptor.
 */
export class RepeatTemplate implements RepeatOperations {
  protected readonly _logger: Logger = LoggerFactory.getLogger(
    RepeatTemplate.name,
  );
  protected listeners: RepeatListener[] = [];
  protected completionPolicy: CompletionPolicy =
    new DefaultResultCompletionPolicy();
  protected exceptionHandler: ExceptionHandler = new DefaultExceptionHandler();

  /** Set the listeners for callbacks during iteration. */
  setListeners(listeners: RepeatListener[]): void {
    this.listeners = [...listeners];
  }

  /** Register an additional listener. */
  registerListener(listener: RepeatListener): void {
    this.listeners.push(listener);
  }

  /** Set the exception handler strategy. */
  setExceptionHandler(exceptionHandler: ExceptionHandler): void {
    this.exceptionHandler = exceptionHandler;
  }

  /** Set the policy used to decide when the batch is complete. */
  setCompletionPolicy(completionPolicy: CompletionPolicy): void {
    if (completionPolicy == null) {
      throw new TypeError("CompletionPolicy is required");
    }
    this.completionPolicy = completionPolicy;
  }

  /** Execute the callback until the completion policy decides that processing is done. */
  iterate(callback: RepeatCallback): RepeatStatus {
    const outer = RepeatSynchronizationManager.getContext();
    try {
      return this.executeInternal(callback);
    } finally {
      RepeatSynchronizationManager.clear();
      if (outer != null) {
        RepeatSynchronizationManager.register(outer);
      }
    }
  }

  private executeInternal(callback: RepeatCallback): RepeatStatus {
    // Reset the termination policy if there is one...
    const context = this.start();
    // Make sure if we are already marked complete before we start then no
    // processing takes place.
    let running = !this.isMarkedComplete(context);
    for (const listener of this.listeners) {
      listener.open?.(context);
      running = running && !this.isMarkedComplete(context);
      if (!running) break;
    }

    // Return value, default is to allow continued processing.
    let result = RepeatStatus.CONTINUABLE;
    const state = this.createInternalState(context);
    // Keep a separate list of exceptions we handled that need to be
    // rethrown
    const deferred: unknown[] = [];
    try {
      while (running) {
        /*
         * Run the before interceptors here, not in the task executor so that they
         * all happen in the same thread - it's easier for tracking batch status,
         * amongst other things.
         */
        for (const listener of this.listeners) {
          listener.before?.(context);
          // Allow before interceptors to veto the batch by setting
          // flag.
          running = running && !this.isMarkedComplete(context);
        }
        // Check that we are still running (should always be true) ...
        if (!running) break;
        try {
          result = this.getNextResult(context, callback, state);
          this.executeAfterInterceptors(context, result);
        } catch (error) {
          this.doHandle(error, context, deferred);
        }
        // N.B. the order may be important here:
        running = !(
          this.isComplete(context, result) ||
          this.isMarkedComplete(context) ||
          deferred.length > 0
        );
      }

      // Explicitly drop any references to internal state...
      result = result.and(this.waitForResults(state));
      for (const throwable of state.throwables) {
        this.doHandle(throwable, context, deferred);
      }
      if (deferred.length > 0) {
        throw deferred[0];
      }
      return result;
    } finally {
      for (let i = this.listeners.length - 1; i >= 0; i -= 1) {
        this.listeners[i].close?.(context);
      }
      context.close();
    }
  }

  /** Create the internal state used during an iteration. */
  protected createInternalState(_context: RepeatContext): RepeatInternalState {
    return new RepeatInternalStateSupport();
  }

  /** Get the next completed result, normally by executing the callback once. */
  protected getNextResult(
    context: RepeatContext,
    callback: RepeatCallback,
    _state: RepeatInternalState,
  ): RepeatStatus {
    this.update(context);
    if (this._logger.isDebugEnabled()) {
      this._logger.debug(
        `Repeat operation about to start at count=${context.startedCount}`,
      );
    }
    return callback.doInIteration(context);
  }

  /** Wait for remote or concurrent results; the default implementation does nothing. */
  protected waitForResults(_state: RepeatInternalState): boolean {
    // no-op by default
    return true;
  }

  /** Check whether the result can continue the iteration. */
  protected canContinue(value: RepeatStatus | null): boolean {
    return value != null && value.isContinuable;
  }

  private isMarkedComplete(context: RepeatContext): boolean {
    const complete =
      context.isCompleteOnly ||
      (context.parent != null && this.isMarkedComplete(context.parent));
    if (complete) {
      this._logger.debug("Repeat is complete according to context alone.");
    }
    return complete;
  }

  /** Execute listeners after a callback result without rethrowing here. */
  protected executeAfterInterceptors(
    context: RepeatContext,
    value: RepeatStatus | null,
  ): void {
    // Don't re-throw exceptions here: let the exception handler deal with
    // that...
    if (this.canContinue(value)) {
      for (let i = this.listeners.length - 1; i >= 0; i -= 1) {
        this.listeners[i].after?.(context, value as RepeatStatus);
      }
    }
  }

  /** Delegate completion decisions to the configured policy. */
  protected isComplete(
    context: RepeatContext,
    result: RepeatStatus | null,
  ): boolean;
  protected isComplete(context: RepeatContext): boolean;
  protected isComplete(
    context: RepeatContext,
    result?: RepeatStatus | null,
  ): boolean {
    const complete = this.completionPolicy.isComplete(context, result ?? null);
    if (complete) {
      this._logger.debug(
        result === undefined
          ? "Repeat is complete according to policy alone not including result."
          : "Repeat is complete according to policy and result value.",
      );
    }
    return complete;
  }

  /** Start and register a context through the configured completion policy. */
  protected start(): RepeatContext {
    const context = this.completionPolicy.start(
      RepeatSynchronizationManager.getContext(),
    );
    RepeatSynchronizationManager.register(context);
    this._logger.debug("Starting repeat context.");
    return context;
  }

  /** Update the context through the configured completion policy. */
  protected update(context: RepeatContext): void {
    this.completionPolicy.update(context);
  }

  private doHandle(
    throwable: unknown,
    context: RepeatContext,
    deferred: unknown[],
  ): void {
    // An exception alone is not sufficient grounds for not
    // continuing
    for (let i = this.listeners.length - 1; i >= 0; i -= 1) {
      this.listeners[i].onError?.(context, throwable);
    }
    try {
      this.exceptionHandler.handleException(context, throwable);
    } catch (handled) {
      deferred.push(handled);
    }
  }
}
