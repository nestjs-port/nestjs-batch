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

import { describe, expect, it } from "vitest";
import { RepeatContextSupport } from "../../context/index.js";
import { RepeatStatus } from "../../repeat-status.js";
import type { RepeatListener } from "../../repeat-listener.js";
import { CompositeRepeatListener } from "../composite-repeat-listener.js";

describe("CompositeRepeatListener", () => {
  const context = new RepeatContextSupport(null);

  it("test set listeners", () => {
    const list: string[] = [];
    const listener = new CompositeRepeatListener();

    listener.setListeners([
      {
        open() {
          list.push("fail");
        },
      },
      {
        open() {
          list.push("continue");
        },
      },
    ]);

    listener.open(context);
    expect(list).toHaveLength(2);
  });

  it("test register", () => {
    const list: string[] = [];
    const listener = new CompositeRepeatListener();

    listener.register({
      before() {
        list.push("fail");
      },
    });

    listener.before(context);
    expect(list).toHaveLength(1);
  });

  it("test close", () => {
    const list: string[] = [];
    const listener = new CompositeRepeatListener();

    listener.register({
      close() {
        list.push("foo");
      },
    });

    listener.close(context);
    expect(list).toHaveLength(1);
  });

  it("test on error", () => {
    const list: unknown[] = [];
    const listener = new CompositeRepeatListener();

    listener.register({
      onError(_context, error) {
        list.push(error);
      },
    });

    listener.onError(context, new Error("foo"));
    expect(list).toHaveLength(1);
  });

  it("delegates all callbacks", () => {
    const calls: string[] = [];
    const first: RepeatListener = {
      before() {
        calls.push("before");
      },
      after() {
        calls.push("after");
      },
      open() {
        calls.push("open");
      },
      close() {
        calls.push("close");
      },
      onError() {
        calls.push("error");
      },
    };

    const listener = new CompositeRepeatListener(first);
    listener.before(context);
    listener.after(context, RepeatStatus.CONTINUABLE);
    listener.open(context);
    listener.onError(context, new Error("boom"));
    listener.close(context);

    expect(calls).toEqual(["before", "after", "open", "error", "close"]);
  });
});
