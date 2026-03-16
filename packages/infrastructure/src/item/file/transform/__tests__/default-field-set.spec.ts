import { SimpleDateFormat } from "@nestjs-batch/commons";
import { beforeEach, describe, expect, it } from "vitest";

import type { FieldSet } from "../field-set.interface";
import { DefaultFieldSet } from "../default-field-set";

function javaArrayHashCode(values: Array<string | null>): number {
  if (values.length === 0) {
    return 0;
  }

  let result = 1;
  for (const token of values) {
    let tokenHash = 0;
    if (token != null) {
      for (let i = 0; i < token.length; i += 1) {
        tokenHash = (31 * tokenHash + token.charCodeAt(i)) | 0;
      }
    }
    result = (31 * result + tokenHash) | 0;
  }
  return result;
}

describe("DefaultFieldSet", () => {
  let fieldSet: DefaultFieldSet;
  let tokens: Array<string | null>;
  let names: string[];

  beforeEach(() => {
    tokens = [
      "TestString",
      "true",
      "C",
      "10",
      "-472",
      "354224",
      "543",
      "124.3",
      "424.3",
      "1,3245",
      null,
      "2007-10-12",
      "12-10-2007",
      "",
    ];
    names = [
      "String",
      "Boolean",
      "Char",
      "Byte",
      "Short",
      "Integer",
      "Long",
      "Float",
      "Double",
      "BigDecimal",
      "Null",
      "Date",
      "DatePattern",
      "BlankInput",
    ];

    fieldSet = new DefaultFieldSet(tokens, names);
    expect(fieldSet.fieldCount).toBe(14);
  });

  it("test names", () => {
    expect(fieldSet.hasNames()).toBe(true);
    expect(fieldSet.names.length).toBe(fieldSet.fieldCount);
  });

  it("test names not known", () => {
    fieldSet = new DefaultFieldSet(["foo"]);
    expect(fieldSet.hasNames()).toBe(false);
    expect(() => fieldSet.names).toThrow();
  });

  it("test read string", () => {
    expect(fieldSet.readString(0)).toBe("TestString");
    expect(fieldSet.readString("String")).toBe("TestString");
  });

  it("test read char", () => {
    expect(fieldSet.readChar(2)).toBe("C");
    expect(fieldSet.readChar("Char")).toBe("C");
  });

  it("test read boolean true", () => {
    expect(fieldSet.readBoolean(1)).toBe(true);
    expect(fieldSet.readBoolean("Boolean")).toBe(true);
  });

  it("test read byte", () => {
    expect(fieldSet.readByte(3)).toBe(10);
    expect(fieldSet.readByte("Byte")).toBe(10);
  });

  it("test read short", () => {
    expect(fieldSet.readShort(4)).toBe(-472);
    expect(fieldSet.readShort("Short")).toBe(-472);
  });

  it("test read integer as float", () => {
    expect(fieldSet.readFloat(5)).toBeCloseTo(354224, 3);
    expect(fieldSet.readFloat("Integer")).toBeCloseTo(354224, 3);
  });

  it("test read float", () => {
    expect(fieldSet.readFloat(7)).toBeCloseTo(124.3, 3);
    expect(fieldSet.readFloat("Float")).toBeCloseTo(124.3, 3);
  });

  it("test read integer as double", () => {
    expect(fieldSet.readDouble(5)).toBeCloseTo(354224, 3);
    expect(fieldSet.readDouble("Integer")).toBeCloseTo(354224, 3);
  });

  it("test read double", () => {
    expect(fieldSet.readDouble(8)).toBeCloseTo(424.3, 3);
    expect(fieldSet.readDouble("Double")).toBeCloseTo(424.3, 3);
  });

  it("test read big decimal", () => {
    const bd = 424.3;
    expect(fieldSet.readBigDecimal(8)).toBe(bd);
    expect(fieldSet.readBigDecimal("Double")).toBe(bd);
  });

  it("test read big big decimal", () => {
    fieldSet = new DefaultFieldSet(["12345678901234567890"]);
    const bd = Number("12345678901234567890");
    expect(fieldSet.readBigDecimal(0)).toBe(bd);
  });

  it("test read big decimal with format", () => {
    fieldSet.setNumberFormat(new Intl.NumberFormat("en-US"));
    const bd = 424.3;
    expect(fieldSet.readBigDecimal(8)).toBe(bd);
  });

  it("test read big decimal with euro format", () => {
    fieldSet.setNumberFormat(new Intl.NumberFormat("de-DE"));
    const bd = 1.3245;
    expect(fieldSet.readBigDecimal(9)).toBe(bd);
  });

  it("test read big decimal with defaultvalue", () => {
    const bd = 324;
    expect(fieldSet.readBigDecimal(10, bd)).toBe(bd);
    expect(fieldSet.readBigDecimal("Null", bd)).toBe(bd);
  });

  it("test read non existent field", () => {
    expect(() => fieldSet.readString("something")).toThrow("something");
  });

  it("test read index out of range", () => {
    expect(() => fieldSet.readShort(-1)).toThrow();
    expect(() => fieldSet.readShort(99)).toThrow();
  });

  it("test read boolean with true value", () => {
    expect(fieldSet.readBoolean(1, "true")).toBe(true);
    expect(fieldSet.readBoolean(1, "incorrect trueValue")).toBe(false);

    expect(fieldSet.readBoolean("Boolean", "true")).toBe(true);
    expect(fieldSet.readBoolean("Boolean", "incorrect trueValue")).toBe(false);
  });

  it("test read boolean false", () => {
    fieldSet = new DefaultFieldSet(["false"]);
    expect(fieldSet.readBoolean(0)).toBe(false);
  });

  it("test read char exception", () => {
    expect(() => fieldSet.readChar(1)).toThrow();
    expect(() => fieldSet.readChar("Boolean")).toThrow();
  });

  it("test read int", () => {
    expect(fieldSet.readInt(5)).toBe(354224);
    expect(fieldSet.readInt("Integer")).toBe(354224);
  });

  it("test read int with separator", () => {
    fieldSet = new DefaultFieldSet(["354,224"]);
    expect(fieldSet.readInt(0)).toBe(354224);
  });

  it("test read int with separator and format", () => {
    fieldSet = new DefaultFieldSet(["354.224"]);
    fieldSet.setNumberFormat(new Intl.NumberFormat("de-DE"));
    expect(fieldSet.readInt(0)).toBe(354224);
  });

  it("test read blank int", () => {
    expect(() => fieldSet.readInt(13)).toThrow();
    expect(() => fieldSet.readInt("BlankInput")).toThrow();
  });

  it("test read long", () => {
    expect(fieldSet.readLong(6)).toBe(543);
    expect(fieldSet.readLong("Long")).toBe(543);
  });

  it("test read long with padding", () => {
    fieldSet = new DefaultFieldSet(["000009"]);
    expect(fieldSet.readLong(0)).toBe(9);
  });

  it("test read int with null value", () => {
    expect(fieldSet.readInt(10, 5)).toBe(5);
    expect(fieldSet.readInt("Null", 5)).toBe(5);
  });

  it("test read int with default and not null", () => {
    expect(fieldSet.readInt(5, 5)).toBe(354224);
    expect(fieldSet.readInt("Integer", 5)).toBe(354224);
  });

  it("test read long with null value", () => {
    const defaultValue = 5;
    const indexOfNull = 10;
    const indexNotNull = 6;
    const nameNull = "Null";
    const nameNotNull = "Long";
    const longValueAtIndex = 543;

    expect(fieldSet.readLong(indexOfNull, defaultValue)).toBe(defaultValue);
    expect(fieldSet.readLong(indexNotNull, defaultValue)).toBe(longValueAtIndex);

    expect(fieldSet.readLong(nameNull, defaultValue)).toBe(defaultValue);
    expect(fieldSet.readLong(nameNotNull, defaultValue)).toBe(longValueAtIndex);
  });

  it("test read big decimal invalid", () => {
    expect(() => fieldSet.readBigDecimal(0)).toThrow("TestString");
  });

  it("test read big decimal by name invalid", () => {
    expect(() => fieldSet.readBigDecimal("String")).toThrow("TestString");
    expect(() => fieldSet.readBigDecimal("String")).toThrow("name: [String]");
  });

  it("test read date", () => {
    expect(fieldSet.readDate(11)).not.toBeNull();
    expect(fieldSet.readDate("Date")).not.toBeNull();
  });

  it("test read date with default", () => {
    const date = null as unknown as Date;
    expect(fieldSet.readDate(13, date)).toBe(date);
    expect(fieldSet.readDate("BlankInput", date)).toBe(date);
  });

  it("test read date with format", () => {
    fieldSet = new DefaultFieldSet(["13/01/1999"]);
    const dateFormat = new SimpleDateFormat("dd/MM/yyyy");
    fieldSet.setDateFormat(dateFormat);
    expect(fieldSet.readDate(0)).toEqual(dateFormat.parse("13/01/1999"));
  });

  it("test read date invalid", () => {
    expect(() => fieldSet.readDate(0)).toThrow("TestString");
  });

  it("test read date invalid by name", () => {
    expect(() => fieldSet.readDate("String")).toThrow("name: [String]");
  });

  it("test read date invalid with pattern", () => {
    expect(() => fieldSet.readDate(0, "dd-MM-yyyy")).toThrow("dd-MM-yyyy");
  });

  it("test read date with pattern and default", () => {
    const date = null as unknown as Date;
    expect(fieldSet.readDate(13, "dd-MM-yyyy", date)).toBe(date);
    expect(fieldSet.readDate("BlankInput", "dd-MM-yyyy", date)).toBe(date);
  });

  it("test read date invalid with default", () => {
    const defaultDate = new Date();
    expect(() => fieldSet.readDate(1, defaultDate)).toThrow("yyyy-MM-dd");

    expect(() => fieldSet.readDate("String", defaultDate)).toThrow("yyyy-MM-dd");
    expect(() => fieldSet.readDate("String", defaultDate)).toThrow("name: [String]");

    expect(() => fieldSet.readDate(1, "dd-MM-yyyy", defaultDate)).toThrow(
      "dd-MM-yyyy",
    );

    expect(() => fieldSet.readDate("String", "dd-MM-yyyy", defaultDate)).toThrow(
      "dd-MM-yyyy",
    );
    expect(() =>
      fieldSet.readDate("String", "dd-MM-yyyy", defaultDate),
    ).toThrow("name: [String]");
  });

  it("test strict read date with pattern", () => {
    fieldSet = new DefaultFieldSet(["50-2-13"]);
    expect(() => fieldSet.readDate(0, "dd-MM-yyyy")).toThrow("dd-MM-yyyy");
  });

  it("test strict read date with pattern and strange date", () => {
    fieldSet = new DefaultFieldSet(["5550212"]);
    expect(() => fieldSet.readDate(0, "yyyyMMdd")).toThrow("yyyyMMdd");
  });

  it("test read date by name invalid with pattern", () => {
    expect(() => fieldSet.readDate("String", "dd-MM-yyyy")).toThrow("dd-MM-yyyy");
    expect(() => fieldSet.readDate("String", "dd-MM-yyyy")).toThrow("String");
  });

  it("test equals", () => {
    expect(fieldSet.values as Array<string | null>).toEqual(
      fieldSet.values as Array<string | null>,
    );
    expect(fieldSet.values as Array<string | null>).toEqual(
      new DefaultFieldSet(tokens).values as Array<string | null>,
    );

    const tokens1 = ["token1"];
    const tokens2 = ["token1"];
    const fs1 = new DefaultFieldSet(tokens1);
    const fs2 = new DefaultFieldSet(tokens2);
    expect(fs1.values as Array<string | null>).toEqual(
      fs2.values as Array<string | null>,
    );
  });

  it("test null field", () => {
    expect(fieldSet.readString(10)).toBeNull();
  });

  it("test equals null", () => {
    expect(fieldSet).not.toBeNull();
  });

  it("test equals null tokens", () => {
    expect(new DefaultFieldSet(null).values as Array<string | null>).not.toEqual(
      fieldSet.values as Array<string | null>,
    );
  });

  it("test equals not equal", () => {
    const tokens1 = ["token1"];
    const tokens2 = ["token1", "token2"];
    const fs1: FieldSet = new DefaultFieldSet(tokens1);
    const fs2: FieldSet = new DefaultFieldSet(tokens2);
    expect(fs1.values as Array<string | null>).not.toEqual(
      fs2.values as Array<string | null>,
    );
  });

  it("test hash code", () => {
    expect(
      javaArrayHashCode(fieldSet.values as Array<string | null>),
    ).toBe(
      javaArrayHashCode(
        new DefaultFieldSet(tokens).values as Array<string | null>,
      ),
    );
  });

  it("test hash code with null tokens", () => {
    expect(
      javaArrayHashCode(new DefaultFieldSet(null).values as Array<string | null>),
    ).toBe(0);
  });

  it("test constructor", () => {
    expect(() => new DefaultFieldSet(["1", "2"], ["a"])).toThrow();
  });

  it("test to string with names", () => {
    fieldSet = new DefaultFieldSet(["foo", "bar"], ["Foo", "Bar"]);
    expect(JSON.stringify(fieldSet.properties)).toContain('"Foo":"foo"');
  });

  it("test to string without names", () => {
    fieldSet = new DefaultFieldSet(["foo", "bar"]);
    expect(JSON.stringify(fieldSet.values)).toContain("foo");
  });

  it("test to string null tokens", () => {
    fieldSet = new DefaultFieldSet(null);
    expect(JSON.stringify(fieldSet.values)).toBe("[]");
  });

  it("test properties", () => {
    expect(
      new DefaultFieldSet(["foo", "bar"], ["Foo", "Bar"]).properties.Foo,
    ).toBe("foo");
  });

  it("test properties with no names", () => {
    expect(() => new DefaultFieldSet(["foo", "bar"]).properties).toThrow();
  });

  it("test properties with white space", () => {
    expect(
      new DefaultFieldSet(["foo", "bar   "], ["Foo", "Bar"]).properties.Bar,
    ).toBe("bar");
  });

  it("test properties with null values", () => {
    fieldSet = new DefaultFieldSet([null, "bar"], ["Foo", "Bar"]);
    expect(fieldSet.properties.Bar).toBe("bar");
    expect(fieldSet.properties.Foo).toBeUndefined();
  });

  it("test access by name when names missing", () => {
    expect(() => new DefaultFieldSet(["1", "2"]).readInt("a")).toThrow();
  });

  it("test get values", () => {
    const values = fieldSet.values as Array<string | null>;
    expect(values.length).toBe(tokens.length);
    for (let i = 0; i < tokens.length; i += 1) {
      expect(values[i]).toBe(tokens[i]);
    }
  });

  it("test padded long", () => {
    const fs: FieldSet = new DefaultFieldSet(["00000009"]);
    const value = fs.readLong(0);
    expect(value).toBe(9);
  });

  it("test read raw string", () => {
    const name = "fieldName";
    const value = " string with trailing whitespace   ";
    const fs: FieldSet = new DefaultFieldSet([value], [name]);

    expect(fs.readRawString(0)).toBe(value);
    expect(fs.readRawString(name)).toBe(value);
  });
});
