/*
 * Copyright 2006-present the original author or authors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import type { SkipPolicy } from "./skip-policy.js";

export class CompositeSkipPolicy implements SkipPolicy {
  private _skipPolicies: SkipPolicy[];

  constructor(skipPolicies: SkipPolicy[] = []) {
    this._skipPolicies = skipPolicies;
  }

  get skipPolicies(): SkipPolicy[] {
    return this._skipPolicies;
  }

  set skipPolicies(value: SkipPolicy[]) {
    this._skipPolicies = value;
  }

  shouldSkip(exception: unknown, skipCount: number): boolean {
    return this._skipPolicies.some((policy) =>
      policy.shouldSkip(exception, skipCount),
    );
  }
}
