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

import { beforeEach, describe, expect, it } from "vitest";

import { SynchronizedAttributeAccessor } from "../synchronized-attribute-accessor.js";

class AttributeAccessorSupport {
  private readonly _attributes = new Map<string, unknown>();

  setAttribute(name: string, value: unknown): void {
    this._attributes.set(name, value);
  }
}

describe("SynchronizedAttributeAccessor", () => {
  let accessor: SynchronizedAttributeAccessor;

  beforeEach(() => {
    accessor = new SynchronizedAttributeAccessor();
  });

  it("test hash code", () => {
    const another = new SynchronizedAttributeAccessor();
    accessor.setAttribute("foo", "bar");
    another.setAttribute("foo", "bar");
    expect(accessor.attributeNames()).toEqual(another.attributeNames());
    expect(accessor.getAttribute("foo")).toBe(another.getAttribute("foo"));
  });

  it("test to string with no attributes", () => {
    expect(accessor.toString()).not.toBeNull();
  });

  it("test to string with attributes", () => {
    accessor.setAttribute("foo", "bar");
    accessor.setAttribute("spam", "bucket");
    expect(accessor.toString()).not.toBeNull();
  });

  it("test attribute names", () => {
    accessor.setAttribute("foo", "bar");
    accessor.setAttribute("spam", "bucket");
    const list = accessor.attributeNames();
    expect(list).toHaveLength(2);
    expect(list).toContain("foo");
  });

  it("test equals same type", () => {
    const another = new SynchronizedAttributeAccessor();
    accessor.setAttribute("foo", "bar");
    another.setAttribute("foo", "bar");
    expect(accessor.attributeNames()).toEqual(another.attributeNames());
    expect(accessor.getAttribute("foo")).toBe(another.getAttribute("foo"));
  });

  it("test equals self", () => {
    accessor.setAttribute("foo", "bar");
    expect(accessor.attributeNames()).toContain("foo");
  });

  it("test equals wrong type", () => {
    accessor.setAttribute("foo", "bar");
    const another = { foo: "bar" };
    // Accessor and another are instances of unrelated classes, they should
    // never be equal...
    expect(accessor).not.toEqual(another);
  });

  it("test equals support", () => {
    const another = new AttributeAccessorSupport();
    accessor.setAttribute("foo", "bar");
    another.setAttribute("foo", "bar");
    expect(accessor.attributeNames()).toContain("foo");
    expect(accessor.getAttribute("foo")).toBe("bar");
  });

  it("test get attribute", () => {
    accessor.setAttribute("foo", "bar");
    expect(accessor.getAttribute("foo")).toBe("bar");
  });

  it("test set attribute if absent when already present", () => {
    accessor.setAttribute("foo", "bar");
    expect(accessor.setAttributeIfAbsent("foo", "spam")).toBe("bar");
  });

  it("test set attribute if absent when not already present", () => {
    expect(accessor.setAttributeIfAbsent("foo", "bar")).toBeNull();
    expect(accessor.getAttribute("foo")).toBe("bar");
  });

  it("test has attribute", () => {
    accessor.setAttribute("foo", "bar");
    expect(accessor.hasAttribute("foo")).toBe(true);
  });

  it("test remove attribute", () => {
    accessor.setAttribute("foo", "bar");
    expect(accessor.getAttribute("foo")).toBe("bar");
    accessor.removeAttribute("foo");
    expect(accessor.getAttribute("foo")).toBeNull();
  });
});
