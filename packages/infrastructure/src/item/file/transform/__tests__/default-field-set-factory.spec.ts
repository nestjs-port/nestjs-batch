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

import { SimpleDateFormat } from "@nestjs-batch/commons";
import { beforeEach, describe, expect, it } from "vitest";

import { DefaultFieldSetFactory } from "../default-field-set-factory.js";

describe("DefaultFieldSetFactory", () => {
  let factory: DefaultFieldSetFactory;

  beforeEach(() => {
    factory = new DefaultFieldSetFactory();
  });

  it("test vanilla field set", () => {
    const fieldSet = factory.create(["foo", "bar"]);
    expect(fieldSet.readString(0)).toBe("foo");
  });

  it("test vanilla field set with names", () => {
    const fieldSet = factory.create(["1", "bar"], ["foo", "bar"]);
    expect(fieldSet.readInt("foo")).toBe(1);
  });

  it("test field set with date format", () => {
    const format = new SimpleDateFormat("yyyy/MM/dd");
    factory.setDateFormat(format);
    const fieldSet = factory.create(["1999/12/18", "bar"]);
    expect(fieldSet.readDate(0).getTime()).toBe(
      format.parse("1999/12/18").getTime(),
    );
  });

  it("test field set with number format", () => {
    factory.setNumberFormat(new Intl.NumberFormat("de-DE"));
    const fieldSet = factory.create(["19.991.218", "bar"]);
    expect(fieldSet.readInt(0)).toBe(19991218);
  });
});
