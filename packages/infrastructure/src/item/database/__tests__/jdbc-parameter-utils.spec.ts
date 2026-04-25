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

import { JdbcParameterUtils } from "../jdbc-parameter-utils.js";

describe("JdbcParameterUtils", () => {
  it("testCountParameterPlaceholders", () => {
    expect(JdbcParameterUtils.countParameterPlaceholders(null, null)).toBe(0);
    expect(JdbcParameterUtils.countParameterPlaceholders("", null)).toBe(0);
    expect(JdbcParameterUtils.countParameterPlaceholders("?", null)).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        `The "big" ? 'bad wolf'`,
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big ?? bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big ? ? bad ? wolf",
        null,
      ),
    ).toBe(3);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        `The "big?" 'ba''ad?' ? wolf`,
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(":parameter", null),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        `The "big" :parameter 'bad wolf'`,
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big :parameter :parameter bad wolf",
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big :parameter :newpar :parameter bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big :parameter, :newpar, :parameter bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        `The "big:" 'ba''ad:p' :parameter wolf`,
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders("&parameter", null),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        `The "big" &parameter 'bad wolf'`,
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big &parameter &parameter bad wolf",
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big &parameter &newparameter &parameter bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big &parameter, &newparameter, &parameter bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        `The "big &x  " 'ba''ad&p' &parameter wolf`,
        null,
      ),
    ).toBe(1);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big :parameter, &newparameter, &parameter bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big :parameter, &sameparameter, &sameparameter bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "The big :parameter, :sameparameter, :sameparameter bad wolf",
        null,
      ),
    ).toBe(2);
    expect(
      JdbcParameterUtils.countParameterPlaceholders("xxx & yyy", null),
    ).toBe(0);
    const l: string[] = [];
    expect(
      JdbcParameterUtils.countParameterPlaceholders(
        "select :par1, :par2 :par3",
        l,
      ),
    ).toBe(3);
    expect(l.length).toBe(3);
  });
});
