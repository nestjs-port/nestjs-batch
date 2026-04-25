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
