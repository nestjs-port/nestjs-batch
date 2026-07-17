/*
 * Copyright 2006-present the original author or authors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import type { SkipPolicy } from "./skip-policy.js";

/** {@link SkipPolicy} implementation that never skips an item. */
export class NeverSkipItemSkipPolicy implements SkipPolicy {
  shouldSkip(_exception: unknown, _skipCount: number): boolean {
    return false;
  }
}
