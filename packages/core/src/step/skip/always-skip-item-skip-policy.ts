/*
 * Copyright 2006-present the original author or authors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0
 */

import type { SkipPolicy } from "./skip-policy.js";

/** Implementation of {@link SkipPolicy} that always skips an item. */
export class AlwaysSkipItemSkipPolicy implements SkipPolicy {
  shouldSkip(_exception: unknown, _skipCount: number): boolean {
    return true;
  }
}
