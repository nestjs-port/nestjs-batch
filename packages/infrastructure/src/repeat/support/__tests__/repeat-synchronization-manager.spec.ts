/*
 * Copyright 2006-2025 the original author or authors.
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

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { RepeatContextSupport } from "../../context";
import { RepeatSynchronizationManager } from "../repeat-synchronization-manager";

describe("RepeatSynchronizationManagerTests", () => {
  let context: RepeatContextSupport;

  beforeEach(() => {
    context = new RepeatContextSupport(null);
    RepeatSynchronizationManager.clear();
  });

  afterEach(() => {
    RepeatSynchronizationManager.clear();
  });

  it("test get context", () => {
    RepeatSynchronizationManager.register(context);
    expect(RepeatSynchronizationManager.getContext()).toBe(context);
  });

  it("test set session complete only", () => {
    expect(RepeatSynchronizationManager.getContext()).toBeNull();
    RepeatSynchronizationManager.register(context);
    expect(RepeatSynchronizationManager.getContext()?.isCompleteOnly).toBe(false);
    RepeatSynchronizationManager.setCompleteOnly();
    expect(RepeatSynchronizationManager.getContext()?.isCompleteOnly).toBe(true);
  });

  it("test set session complete only with parent", () => {
    expect(RepeatSynchronizationManager.getContext()).toBeNull();
    const child = new RepeatContextSupport(context);
    RepeatSynchronizationManager.register(child);
    expect(child.isCompleteOnly).toBe(false);
    RepeatSynchronizationManager.setAncestorsCompleteOnly();
    expect(child.isCompleteOnly).toBe(true);
    expect(context.isCompleteOnly).toBe(true);
  });

  it("test clear", () => {
    RepeatSynchronizationManager.register(context);
    expect(RepeatSynchronizationManager.getContext()).toBe(context);
    RepeatSynchronizationManager.clear();
    expect(RepeatSynchronizationManager.getContext()).toBeNull();
  });
});
