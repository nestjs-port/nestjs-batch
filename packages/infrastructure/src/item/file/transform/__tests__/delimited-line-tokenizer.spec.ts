import { beforeEach, describe, expect, it } from "vitest";

import { DelimitedLineTokenizer } from "../delimited-line-tokenizer";
import { IncorrectTokenCountException } from "../incorrect-token-count-exception";

describe("DelimitedLineTokenizer", () => {
  let tokenizer: DelimitedLineTokenizer;

  beforeEach(() => {
    tokenizer = new DelimitedLineTokenizer();
  });

  it("test tokenize regular use", () => {
    let tokens = tokenizer.tokenize(
      'sfd,"Well,I have no idea what to do in the afternoon",sFj, asdf,,as\n',
    );
    expect(tokens.fieldCount).toBe(6);
    expect(tokens.readString(0)).toBe("sfd");
    expect(tokens.readString(1)).toBe(
      "Well,I have no idea what to do in the afternoon",
    );
    expect(tokens.readString(2)).toBe("sFj");
    expect(tokens.readString(3)).toBe("asdf");
    expect(tokens.readString(4)).toBe("");
    expect(tokens.readString(5)).toBe("as");

    tokens = tokenizer.tokenize("First string,");
    expect(tokens.fieldCount).toBe(2);
    expect(tokens.readString(0)).toBe("First string");
    expect(tokens.readString(1)).toBe("");
  });

  it("test blank string", () => {
    const tokens = tokenizer.tokenize("   ");
    expect(tokens.readString(0)).toBe("");
  });

  it("test empty string", () => {
    const tokens = tokenizer.tokenize('""');
    expect(tokens.readString(0)).toBe("");
  });

  it("test invalid constructor argument", () => {
    expect(
      () =>
        new DelimitedLineTokenizer(
          DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER,
        ),
    ).toThrow(/./);
  });

  it("test delimited line tokenizer", () => {
    const line = tokenizer.tokenize("a,b,c");
    expect(line.fieldCount).toBe(3);
  });

  it("test names", () => {
    tokenizer.setNames("A", "B", "C");
    const line = tokenizer.tokenize("a,b,c");
    expect(line.fieldCount).toBe(3);
    expect(line.readString("A")).toBe("a");
  });

  it("test too few names", () => {
    tokenizer.setNames("A", "B");
    const exception = (() => {
      try {
        tokenizer.tokenize("a,b,c");
      } catch (e) {
        return e as IncorrectTokenCountException;
      }
    })();
    expect(exception).toBeInstanceOf(IncorrectTokenCountException);
    expect(exception?.expectedCount).toBe(2);
    expect(exception?.actualCount).toBe(3);
    expect(exception?.input).toBe("a,b,c");
  });

  it("test too few names not strict", () => {
    tokenizer.setNames("A", "B");
    tokenizer.setStrict(false);

    const tokens = tokenizer.tokenize("a,b,c");

    expect(tokens.readString(0)).toBe("a");
    expect(tokens.readString(1)).toBe("b");
  });

  it("test too many names", () => {
    tokenizer.setNames("A", "B", "C", "D");
    let exception: unknown;
    try {
      tokenizer.tokenize("a,b,c");
    } catch (e) {
      exception = e;
    }

    expect(exception).toBeInstanceOf(IncorrectTokenCountException);
    const ex = exception as IncorrectTokenCountException;
    expect(ex.expectedCount).toBe(4);
    expect(ex.actualCount).toBe(3);
    expect(ex.input).toBe("a,b,c");
  });

  it("test too many names not strict", () => {
    tokenizer.setNames("A", "B", "C", "D", "E");
    tokenizer.setStrict(false);

    const tokens = tokenizer.tokenize("a,b,c");

    expect(tokens.readString(0)).toBe("a");
    expect(tokens.readString(1)).toBe("b");
    expect(tokens.readString(2)).toBe("c");
    expect(tokens.readString(3)).toBe("");
    expect(tokens.readString(4)).toBe("");
  });

  it("test delimited line tokenizer char", () => {
    const spacedTokenizer = new DelimitedLineTokenizer(" ");
    const line = spacedTokenizer.tokenize("a b c");
    expect(line.fieldCount).toBe(3);
  });

  it("test delimited line tokenizer null delimiter", () => {
    expect(() => new DelimitedLineTokenizer(null as unknown as string)).toThrow(
      /./,
    );
  });

  it("test delimited line tokenizer string", () => {
    const spacedTokenizer = new DelimitedLineTokenizer(" b ");
    const line = spacedTokenizer.tokenize("a b c");
    expect(line.fieldCount).toBe(2);
    expect(line.readString(0)).toBe("a");
    expect(line.readString(1)).toBe("c");
  });

  it("test delimited line tokenizer string beginning of line", () => {
    const pipedTokenizer = new DelimitedLineTokenizer(" | ");
    const line = pipedTokenizer.tokenize(" | a | b");
    expect(line.fieldCount).toBe(3);
    expect(line.readString(0)).toBe("");
    expect(line.readString(1)).toBe("a");
    expect(line.readString(2)).toBe("b");
  });

  it("test delimited line tokenizer string end of line", () => {
    const pipedTokenizer = new DelimitedLineTokenizer(" | ");
    const line = pipedTokenizer.tokenize("a | b | ");
    expect(line.fieldCount).toBe(3);
    expect(line.readString(0)).toBe("a");
    expect(line.readString(1)).toBe("b");
    expect(line.readString(2)).toBe("");
  });

  it("test delimited line tokenizer strings overlap", () => {
    const pipedTokenizer = new DelimitedLineTokenizer(" | ");
    const line = pipedTokenizer.tokenize("a | | | b");
    expect(line.fieldCount).toBe(3);
    expect(line.readString(0)).toBe("a");
    expect(line.readString(1)).toBe("|");
    expect(line.readString(2)).toBe("b");
  });

  it("test delimited line tokenizer strings overlap without separation", () => {
    const pipedTokenizer = new DelimitedLineTokenizer(" | ");
    const line = pipedTokenizer.tokenize("a | | b");
    expect(line.fieldCount).toBe(2);
    expect(line.readString(0)).toBe("a");
    expect(line.readString(1)).toBe("| b");
  });

  it("test delimited line tokenizer newline token", () => {
    const newlineTokenizer = new DelimitedLineTokenizer("\n");
    const line = newlineTokenizer.tokenize("a b\n c");
    expect(line.fieldCount).toBe(2);
    expect(line.readString(0)).toBe("a b");
    expect(line.readString(1)).toBe("c");
  });

  it("test delimited line tokenizer wrapped token", () => {
    const wrappedTokenizer = new DelimitedLineTokenizer("\nrap");
    const line = wrappedTokenizer.tokenize("a b\nrap c");
    expect(line.fieldCount).toBe(2);
    expect(line.readString(0)).toBe("a b");
    expect(line.readString(1)).toBe("c");
  });

  it("test tokenize with quotes", () => {
    const line = tokenizer.tokenize('a,b,"c"');
    expect(line.fieldCount).toBe(3);
    expect(line.readString(2)).toBe("c");
  });

  it("test tokenize with not default quotes", () => {
    tokenizer.setQuoteCharacter("'");
    const line = tokenizer.tokenize("a,b,'c'");
    expect(line.fieldCount).toBe(3);
    expect(line.readString(2)).toBe("c");
  });

  it("test tokenize with escaped quotes", () => {
    const line = tokenizer.tokenize('a,""b,"""c"');
    expect(line.fieldCount).toBe(3);
    expect(line.readString(1)).toBe('""b');
    expect(line.readString(2)).toBe('"c');
  });

  it("test tokenize with unclosed quotes", () => {
    tokenizer.setQuoteCharacter("'");
    const line = tokenizer.tokenize('a,"b,c');
    expect(line.fieldCount).toBe(3);
    expect(line.readString(1)).toBe('"b');
    expect(line.readString(2)).toBe("c");
  });

  it("test tokenize with space in field", () => {
    const line = tokenizer.tokenize("a,b ,c");
    expect(line.fieldCount).toBe(3);
    expect(line.readRawString(1)).toBe("b ");
  });

  it("test tokenize with space at end", () => {
    const line = tokenizer.tokenize("a,b,c ");
    expect(line.fieldCount).toBe(3);
    expect(line.readRawString(2)).toBe("c ");
  });

  it("test tokenize with quote and space at end", () => {
    const line = tokenizer.tokenize('a,b,"c" ');
    expect(line.fieldCount).toBe(3);
    expect(line.readString(2)).toBe("c");
  });

  it("test tokenize with quote and space before delimiter", () => {
    const line = tokenizer.tokenize('a,"b" ,c');
    expect(line.fieldCount).toBe(3);
    expect(line.readString(1)).toBe("b");
  });

  it("test tokenize with delimiter at end", () => {
    const line = tokenizer.tokenize("a,b,c,");
    expect(line.fieldCount).toBe(4);
    expect(line.readString(2)).toBe("c");
    expect(line.readString(3)).toBe("");
  });

  it("test empty line", () => {
    const line = tokenizer.tokenize("");
    expect(line.fieldCount).toBe(0);
  });

  it("test empty line with names", () => {
    tokenizer.setNames("A", "B");
    let exception: unknown;
    try {
      tokenizer.tokenize("");
    } catch (e) {
      exception = e;
    }

    expect(exception).toBeInstanceOf(IncorrectTokenCountException);
    const ex = exception as IncorrectTokenCountException;
    expect(ex.expectedCount).toBe(2);
    expect(ex.actualCount).toBe(0);
    expect(ex.input).toBe("");
  });

  it("test whitespace line", () => {
    const line = tokenizer.tokenize("  ");
    // whitespace counts as text
    expect(line.fieldCount).toBe(1);
  });

  it("test null line", () => {
    const line = tokenizer.tokenize(null as unknown as string);
    // null doesn't...
    expect(line.fieldCount).toBe(0);
  });

  it("test multi line field", () => {
    const line = tokenizer.tokenize("a,b,c\nrap");
    expect(line.fieldCount).toBe(3);
    expect(line.readString(2)).toBe("c\nrap");
  });

  it("test multi line field with quotes", () => {
    const line = tokenizer.tokenize('a,b,"c\nrap"');
    expect(line.fieldCount).toBe(3);
    expect(line.readString(2)).toBe("c\nrap");
  });

  it("test tokenize with quotes empty value", () => {
    const line = tokenizer.tokenize('"a","b","","d"');
    expect(line.fieldCount).toBe(4);
    expect(line.readString(2)).toBe("");
  });

  it("test tokenize with included fields", () => {
    tokenizer.setIncludedFields(1, 2);
    const line = tokenizer.tokenize('"a","b","c","d"');
    expect(line.fieldCount).toBe(2);
    expect(line.readString(1)).toBe("c");
  });

  it("test tokenize with included fields and empty end", () => {
    tokenizer.setIncludedFields(1, 3);
    const line = tokenizer.tokenize('"a","b","c",');
    expect(line.fieldCount).toBe(2);
    expect(line.readString(1)).toBe("");
  });

  it("test tokenize with included fields and names", () => {
    tokenizer.setIncludedFields(1, 2);
    tokenizer.setNames("foo", "bar");
    const line = tokenizer.tokenize('"a","b","c","d"');
    expect(line.fieldCount).toBe(2);
    expect(line.readString("bar")).toBe("c");
  });

  it("test tokenize with included fields and too few names", () => {
    tokenizer.setIncludedFields(1, 2);
    tokenizer.setNames("foo");
    expect(() => tokenizer.tokenize('"a","b","c","d"')).toThrow(
      IncorrectTokenCountException,
    );
  });

  it("test tokenize with included fields and too many names", () => {
    tokenizer.setIncludedFields(1, 2);
    tokenizer.setNames("foo", "bar", "spam");
    expect(() => tokenizer.tokenize('"a","b","c","d"')).toThrow(
      IncorrectTokenCountException,
    );
  });

  it("test tokenize over multiple lines", () => {
    tokenizer = new DelimitedLineTokenizer(";");
    const line = tokenizer.tokenize(
      'value1;"value2\nvalue2cont";value3;value4',
    );
    expect(line.fieldCount).toBe(4);
    expect(line.readString(1)).toBe("value2\nvalue2cont");
  });
});
