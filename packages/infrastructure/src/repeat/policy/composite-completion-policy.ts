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
import type { RepeatContext } from "../repeat-context.js";
import type { RepeatStatus } from "../repeat-status.js";
import { RepeatContextSupport } from "../context/index.js";

/**
 * Composite policy that loops through a list of delegate policies and answers calls by a
 * consensus.
 */
export class CompositeCompletionPolicy implements CompletionPolicy {
  private policies: CompletionPolicy[] = [];

  /**
   * Setter for the policies.
   * @param policies completion policies used to determine completion by consensus.
   */
  setPolicies(policies: CompletionPolicy[]): void {
    this.policies = [...policies];
  }

  /**
   * This policy is complete if any of the composed policies is complete.
   *
   * @see CompletionPolicy.isComplete
   */
  isComplete(context: RepeatContext, result: RepeatStatus | null): boolean;
  /**
   * This policy is complete if any of the composed policies is complete.
   *
   * @see CompletionPolicy.isComplete
   */
  isComplete(context: RepeatContext): boolean;
  isComplete(context: RepeatContext, result: RepeatStatus | null): boolean {
    const composite = context as CompositeBatchContext;
    return composite.policies.some((policy, index) =>
      policy.isComplete(composite.contexts[index], result),
    );
  }

  /**
   * Create a new composite context from all the available policies.
   *
   * @see CompletionPolicy.start
   */
  start(context: RepeatContext | null): RepeatContext {
    return new CompositeBatchContext(
      context,
      this.policies.map((policy) => policy.start(context)),
      this.policies,
    );
  }

  /**
   * Update all the composed contexts, and also increment the parent context.
   *
   * @see CompletionPolicy.update
   */
  update(context: RepeatContext): void {
    const composite = context as CompositeBatchContext;
    composite.policies.forEach((policy, index) =>
      policy.update(composite.contexts[index]),
    );
    (context as RepeatContextSupport).increment();
  }
}

/**
 * Composite context that knows about the policies and contexts it was created with.
 */
class CompositeBatchContext extends RepeatContextSupport {
  constructor(
    context: RepeatContext,
    readonly contexts: RepeatContext[],
    readonly policies: CompletionPolicy[],
  ) {
    super(context);
    // Save a reference to the policies when we were created - gives some
    // protection against reference changes (e.g. if the number of policies
    // change).
  }
}
