import { SimpleDateFormat } from "@nestjs-batch/commons";
import { beforeEach, describe, expect, it } from "vitest";

import { DefaultFieldSetFactory } from "../default-field-set-factory";

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
