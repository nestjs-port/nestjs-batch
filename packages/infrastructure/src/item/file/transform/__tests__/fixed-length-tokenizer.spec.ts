import { beforeEach, describe, expect, it } from "vitest";

import { FixedLengthTokenizer } from "../fixed-length-tokenizer.js";
import { IncorrectLineLengthException } from "../incorrect-line-length-exception.js";
import { IncorrectTokenCountException } from "../incorrect-token-count-exception.js";
import { Range } from "../range.js";

describe("FixedLengthTokenizer", () => {
  let tokenizer: FixedLengthTokenizer;
  let line: string | null;

  beforeEach(() => {
    tokenizer = new FixedLengthTokenizer();
    line = null;
  });

  it("test tokenize empty string", () => {
    tokenizer.setColumns(new Range(1, 5), new Range(6, 10), new Range(11, 15));

    let exception: IncorrectLineLengthException | null = null;
    try {
      tokenizer.tokenize("");
    } catch (error) {
      exception = error as IncorrectLineLengthException;
    }

    expect(exception).toBeInstanceOf(IncorrectLineLengthException);
    expect(exception?.expectedLength).toBe(15);
    expect(exception?.actualLength).toBe(0);
    expect(exception?.input).toBe("");
  });

  it("test empty string with no ranges", () => {
    tokenizer.setColumns();
    expect(() => tokenizer.tokenize("")).not.toThrow();
  });

  it("test tokenize smaller string than ranges", () => {
    tokenizer.setColumns(new Range(1, 5), new Range(6, 10), new Range(11, 15));

    let exception: IncorrectLineLengthException | null = null;
    try {
      tokenizer.tokenize("12345");
    } catch (error) {
      exception = error as IncorrectLineLengthException;
    }

    expect(exception).toBeInstanceOf(IncorrectLineLengthException);
    expect(exception?.expectedLength).toBe(15);
    expect(exception?.actualLength).toBe(5);
    expect(exception?.input).toBe("12345");
  });

  it("test tokenize smaller string than ranges with whitespace", () => {
    tokenizer.setColumns(new Range(1, 5), new Range(6, 10));
    const tokens = tokenizer.tokenize("12345     ");
    expect(tokens.readString(0)).toBe("12345");
    expect(tokens.readString(1)).toBe("");
  });

  it("test tokenize smaller string than ranges not strict", () => {
    tokenizer.setColumns(new Range(1, 5), new Range(6, 10));
    tokenizer.setStrict(false);
    const tokens = tokenizer.tokenize("12345");
    expect(tokens.readString(0)).toBe("12345");
    expect(tokens.readString(1)).toBe("");
  });

  it("test tokenize smaller string than ranges with whitespace open ended", () => {
    tokenizer.setColumns(new Range(1, 5), new Range(6));
    const tokens = tokenizer.tokenize("12345     ");
    expect(tokens.readString(0)).toBe("12345");
    expect(tokens.readString(1)).toBe("");
  });

  it("test tokenize null string", () => {
    tokenizer.setColumns(new Range(1, 5), new Range(6, 10), new Range(11, 15));

    let exception: IncorrectLineLengthException | null = null;
    try {
      tokenizer.tokenize(null as unknown as string);
    } catch (error) {
      exception = error as IncorrectLineLengthException;
    }

    expect(exception).toBeInstanceOf(IncorrectLineLengthException);
    expect(exception?.input).toBe("");
  });

  it("test tokenize regular use", () => {
    tokenizer.setColumns(new Range(1, 2), new Range(3, 7), new Range(8, 12));
    // test shorter line as defined by record descriptor
    line = "H11234512345";
    const tokens = tokenizer.tokenize(line);
    expect(tokens.fieldCount).toBe(3);
    expect(tokens.readString(0)).toBe("H1");
    expect(tokens.readString(1)).toBe("12345");
    expect(tokens.readString(2)).toBe("12345");
  });

  it("test normal length", () => {
    tokenizer.setColumns(
      new Range(1, 10),
      new Range(11, 25),
      new Range(26, 30),
    );
    // test shorter line as defined by record descriptor
    line = "H1        12345678       12345";
    const tokens = tokenizer.tokenize(line);
    expect(tokens.fieldCount).toBe(3);
    expect(tokens.readString(0)).toBe(line.substring(0, 10).trim());
    expect(tokens.readString(1)).toBe(line.substring(10, 25).trim());
    expect(tokens.readString(2)).toBe(line.substring(25).trim());
  });

  it("test longer lines", () => {
    tokenizer.setColumns(
      new Range(1, 10),
      new Range(11, 25),
      new Range(26, 30),
    );
    line = "H1        12345678       1234567890";

    let exception: IncorrectLineLengthException | null = null;
    try {
      tokenizer.tokenize(line);
    } catch (error) {
      exception = error as IncorrectLineLengthException;
    }

    expect(exception).toBeInstanceOf(IncorrectLineLengthException);
    expect(exception?.expectedLength).toBe(30);
    expect(exception?.actualLength).toBe(35);
    expect(exception?.input).toBe(line);
  });

  it("test longer lines open range", () => {
    tokenizer.setColumns(new Range(1, 10), new Range(11, 25), new Range(26));
    line = "H1        12345678       1234567890";
    const tokens = tokenizer.tokenize(line);
    expect(tokens.readString(0)).toBe(line.substring(0, 10).trim());
    expect(tokens.readString(1)).toBe(line.substring(10, 25).trim());
    expect(tokens.readString(2)).toBe(line.substring(25).trim());
  });

  it("test longer lines not strict", () => {
    tokenizer.setColumns(
      new Range(1, 10),
      new Range(11, 25),
      new Range(26, 30),
    );
    line = "H1        12345678       1234567890";
    tokenizer.setStrict(false);
    const tokens = tokenizer.tokenize(line);
    expect(tokens.readString(0)).toBe(line.substring(0, 10).trim());
    expect(tokens.readString(1)).toBe(line.substring(10, 25).trim());
    expect(tokens.readString(2)).toBe(line.substring(25, 30).trim());
  });

  it("test non adjacent ranges unsorted", () => {
    tokenizer.setColumns(
      new Range(14, 28),
      new Range(34, 38),
      new Range(1, 10),
    );
    // test normal length
    line = "H1        +++12345678       +++++12345";
    const tokens = tokenizer.tokenize(line);
    expect(tokens.fieldCount).toBe(3);
    expect(tokens.readString(2)).toBe(line.substring(0, 10).trim());
    expect(tokens.readString(0)).toBe(line.substring(13, 28).trim());
    expect(tokens.readString(1)).toBe(line.substring(33, 38).trim());
  });

  it("test another type of record", () => {
    tokenizer.setColumns(
      new Range(1, 5),
      new Range(6, 15),
      new Range(16, 25),
      new Range(26, 27),
    );
    // test another type of record
    line = "H2   123456    12345     12";
    const tokens = tokenizer.tokenize(line);
    expect(tokens.fieldCount).toBe(4);
    expect(tokens.readString(0)).toBe(line.substring(0, 5).trim());
    expect(tokens.readString(1)).toBe(line.substring(5, 15).trim());
    expect(tokens.readString(2)).toBe(line.substring(15, 25).trim());
    expect(tokens.readString(3)).toBe(line.substring(25).trim());
  });

  it("test filler at end", () => {
    tokenizer.setColumns(
      new Range(1, 5),
      new Range(6, 15),
      new Range(16, 25),
      new Range(26, 27),
      new Range(34),
    );
    // test another type of record
    line = "H2   123456    12345     12-123456";
    const tokens = tokenizer.tokenize(line);
    expect(tokens.fieldCount).toBe(5);
    expect(tokens.readString(0)).toBe(line.substring(0, 5).trim());
    expect(tokens.readString(1)).toBe(line.substring(5, 15).trim());
    expect(tokens.readString(2)).toBe(line.substring(15, 25).trim());
    expect(tokens.readString(3)).toBe(line.substring(25, 27).trim());
  });

  it("test tokenizer invalid setup", () => {
    tokenizer.setNames("a", "b");
    tokenizer.setColumns(new Range(1, 5));

    let exception: IncorrectTokenCountException | null = null;
    try {
      tokenizer.tokenize("12345");
    } catch (error) {
      exception = error as IncorrectTokenCountException;
    }

    expect(exception).toBeInstanceOf(IncorrectTokenCountException);
    expect(exception?.expectedCount).toBe(2);
    expect(exception?.actualCount).toBe(1);
  });
});
