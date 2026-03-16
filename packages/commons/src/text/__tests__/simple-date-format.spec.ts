import { describe, expect, it } from "vitest";
import { SimpleDateFormat } from "../simple-date-format";

// Helper to create a local Date without timezone ambiguity
function localDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  ms = 0,
): Date {
  return new Date(year, month - 1, day, hour, minute, second, ms);
}

describe("SimpleDateFormat", () => {
  describe("constructor and pattern management", () => {
    it("stores the pattern", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      expect(sdf.pattern).toBe("yyyy-MM-dd");
    });

    it("toPattern returns the current pattern", () => {
      const sdf = new SimpleDateFormat("yyyy/MM/dd");
      expect(sdf.toPattern()).toBe("yyyy/MM/dd");
    });

    it("applyPattern changes the pattern", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      sdf.applyPattern("dd/MM/yyyy");
      expect(sdf.toPattern()).toBe("dd/MM/yyyy");
    });
  });

  describe("format - year patterns", () => {
    const date = localDate(2001, 7, 4, 12, 8, 56, 235);

    it("yyyy formats 4-digit year", () => {
      const sdf = new SimpleDateFormat("yyyy");
      expect(sdf.format(date)).toBe("2001");
    });

    it("yy formats 2-digit year", () => {
      const sdf = new SimpleDateFormat("yy");
      expect(sdf.format(date)).toBe("01");
    });

    it("y formats year without padding", () => {
      const sdf = new SimpleDateFormat("y");
      expect(sdf.format(date)).toBe("2001");
    });
  });

  describe("format - month patterns", () => {
    const date = localDate(2001, 7, 4);

    it("MM formats zero-padded numeric month", () => {
      const sdf = new SimpleDateFormat("MM");
      expect(sdf.format(date)).toBe("07");
    });

    it("M formats numeric month without padding", () => {
      const sdf = new SimpleDateFormat("M");
      expect(sdf.format(date)).toBe("7");
    });

    it("MMM formats abbreviated month name", () => {
      const sdf = new SimpleDateFormat("MMM");
      expect(sdf.format(date)).toBe("Jul");
    });

    it("MMMM formats full month name", () => {
      const sdf = new SimpleDateFormat("MMMM");
      expect(sdf.format(date)).toBe("July");
    });
  });

  describe("format - day patterns", () => {
    const date = localDate(2001, 7, 4);

    it("dd formats zero-padded day", () => {
      const sdf = new SimpleDateFormat("dd");
      expect(sdf.format(date)).toBe("04");
    });

    it("d formats day without padding", () => {
      const sdf = new SimpleDateFormat("d");
      expect(sdf.format(date)).toBe("4");
    });
  });

  describe("format - hour patterns", () => {
    it("HH formats 24-hour zero-padded", () => {
      const sdf = new SimpleDateFormat("HH");
      expect(sdf.format(localDate(2001, 1, 1, 0))).toBe("00");
      expect(sdf.format(localDate(2001, 1, 1, 9))).toBe("09");
      expect(sdf.format(localDate(2001, 1, 1, 15))).toBe("15");
      expect(sdf.format(localDate(2001, 1, 1, 23))).toBe("23");
    });

    it("hh formats 12-hour zero-padded", () => {
      const sdf = new SimpleDateFormat("hh");
      expect(sdf.format(localDate(2001, 1, 1, 0))).toBe("12");
      expect(sdf.format(localDate(2001, 1, 1, 12))).toBe("12");
      expect(sdf.format(localDate(2001, 1, 1, 13))).toBe("01");
      expect(sdf.format(localDate(2001, 1, 1, 23))).toBe("11");
    });

    it("k formats 1-24 hour", () => {
      const sdf = new SimpleDateFormat("k");
      expect(sdf.format(localDate(2001, 1, 1, 0))).toBe("24");
      expect(sdf.format(localDate(2001, 1, 1, 1))).toBe("1");
    });

    it("K formats 0-11 hour", () => {
      const sdf = new SimpleDateFormat("K");
      expect(sdf.format(localDate(2001, 1, 1, 0))).toBe("0");
      expect(sdf.format(localDate(2001, 1, 1, 12))).toBe("0");
      expect(sdf.format(localDate(2001, 1, 1, 13))).toBe("1");
    });
  });

  describe("format - minute, second, millisecond", () => {
    const date = localDate(2001, 7, 4, 12, 8, 56, 235);

    it("mm formats zero-padded minutes", () => {
      const sdf = new SimpleDateFormat("mm");
      expect(sdf.format(date)).toBe("08");
    });

    it("ss formats zero-padded seconds", () => {
      const sdf = new SimpleDateFormat("ss");
      expect(sdf.format(date)).toBe("56");
    });

    it("SSS formats zero-padded milliseconds", () => {
      const sdf = new SimpleDateFormat("SSS");
      expect(sdf.format(date)).toBe("235");
    });

    it("S formats milliseconds without padding", () => {
      const sdf = new SimpleDateFormat("S");
      expect(sdf.format(localDate(2001, 1, 1, 0, 0, 0, 12))).toBe("12");
    });

    it("SSS pads small millisecond values", () => {
      const sdf = new SimpleDateFormat("SSS");
      expect(sdf.format(localDate(2001, 1, 1, 0, 0, 0, 12))).toBe("012");
    });
  });

  describe("format - AM/PM", () => {
    it("a formats AM for morning", () => {
      const sdf = new SimpleDateFormat("a");
      expect(sdf.format(localDate(2001, 1, 1, 10))).toBe("AM");
    });

    it("a formats PM for afternoon", () => {
      const sdf = new SimpleDateFormat("a");
      expect(sdf.format(localDate(2001, 1, 1, 15))).toBe("PM");
    });

    it("a formats AM for midnight", () => {
      const sdf = new SimpleDateFormat("a");
      expect(sdf.format(localDate(2001, 1, 1, 0))).toBe("AM");
    });

    it("a formats PM for noon", () => {
      const sdf = new SimpleDateFormat("a");
      expect(sdf.format(localDate(2001, 1, 1, 12))).toBe("PM");
    });
  });

  describe("format - day of week", () => {
    // July 4, 2001 was a Wednesday
    const date = localDate(2001, 7, 4);

    it("E formats abbreviated day name", () => {
      const sdf = new SimpleDateFormat("E");
      expect(sdf.format(date)).toBe("Wed");
    });

    it("EEEE formats full day name", () => {
      const sdf = new SimpleDateFormat("EEEE");
      expect(sdf.format(date)).toBe("Wednesday");
    });
  });

  describe("format - era", () => {
    it("G formats era designator", () => {
      const sdf = new SimpleDateFormat("G");
      expect(sdf.format(localDate(2001, 1, 1))).toBe("AD");
    });
  });

  describe("format - day of year", () => {
    it("DDD formats zero-padded day of year", () => {
      const sdf = new SimpleDateFormat("DDD");
      // July 4 = 31 + 28 + 31 + 30 + 31 + 30 + 4 = 185
      expect(sdf.format(localDate(2001, 7, 4))).toBe("185");
    });

    it("D formats day of year for Jan 1", () => {
      const sdf = new SimpleDateFormat("D");
      expect(sdf.format(localDate(2001, 1, 1))).toBe("1");
    });
  });

  describe("format - ISO day of week (u)", () => {
    it("u formats Monday as 1", () => {
      const sdf = new SimpleDateFormat("u");
      // July 2, 2001 was a Monday
      expect(sdf.format(localDate(2001, 7, 2))).toBe("1");
    });

    it("u formats Sunday as 7", () => {
      const sdf = new SimpleDateFormat("u");
      // July 1, 2001 was a Sunday
      expect(sdf.format(localDate(2001, 7, 1))).toBe("7");
    });
  });

  describe("format - timezone", () => {
    it("Z formats timezone offset in +/-hhmm form", () => {
      const sdf = new SimpleDateFormat("Z");
      const result = sdf.format(localDate(2001, 7, 4));
      // Should match +hhmm or -hhmm pattern
      expect(result).toMatch(/^[+-]\d{4}$/);
    });

    it("X formats UTC as Z when offset is 0", () => {
      const sdf = new SimpleDateFormat("X");
      const utcDate = new Date(Date.UTC(2001, 6, 4));
      const result = sdf.format(utcDate);
      // Result depends on local timezone, so just verify format
      expect(result).toMatch(/^[+-]\d{2}$|^Z$/);
    });

    it("XXX formats timezone with colon", () => {
      const sdf = new SimpleDateFormat("XXX");
      const result = sdf.format(localDate(2001, 7, 4));
      expect(result).toMatch(/^[+-]\d{2}:\d{2}$|^Z$/);
    });
  });

  describe("format - composite patterns", () => {
    it("yyyy.MM.dd G 'at' HH:mm:ss", () => {
      const sdf = new SimpleDateFormat("yyyy.MM.dd G 'at' HH:mm:ss");
      const date = localDate(2001, 7, 4, 12, 8, 56);
      expect(sdf.format(date)).toBe("2001.07.04 AD at 12:08:56");
    });

    it("EEE, MMM d, ''yy", () => {
      const sdf = new SimpleDateFormat("EEE, MMM d, ''yy");
      const date = localDate(2001, 7, 4);
      expect(sdf.format(date)).toBe("Wed, Jul 4, '01");
    });

    it("h:mm a", () => {
      const sdf = new SimpleDateFormat("h:mm a");
      const date = localDate(2001, 7, 4, 12, 8);
      expect(sdf.format(date)).toBe("12:08 PM");
    });

    it("yyyy-MM-dd", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      expect(sdf.format(localDate(1997, 2, 3))).toBe("1997-02-03");
    });

    it("yyMMdd", () => {
      const sdf = new SimpleDateFormat("yyMMdd");
      expect(sdf.format(localDate(1997, 3, 4))).toBe("970304");
    });

    it("dd-MMM-yyyy", () => {
      const sdf = new SimpleDateFormat("dd-MMM-yyyy");
      expect(sdf.format(localDate(2001, 9, 7))).toBe("07-Sep-2001");
    });
  });

  describe("format - quoted literals", () => {
    it("handles single-quoted text", () => {
      const sdf = new SimpleDateFormat("MM/dd/yyyy 'at' hh:mm:ss a");
      const date = localDate(1997, 8, 13, 10, 42, 28);
      expect(sdf.format(date)).toBe("08/13/1997 at 10:42:28 AM");
    });

    it("handles escaped single quote ''", () => {
      const sdf = new SimpleDateFormat("EEE, MMM d, ''yy");
      const date = localDate(2001, 7, 4);
      expect(sdf.format(date)).toBe("Wed, Jul 4, '01");
    });

    it("handles nested quotes", () => {
      const sdf = new SimpleDateFormat("'Date:' yyyy-MM-dd");
      const date = localDate(2001, 7, 4);
      expect(sdf.format(date)).toBe("Date: 2001-07-04");
    });
  });

  describe("parse - basic patterns", () => {
    it("yyyy-MM-dd parses date correctly", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      const result = sdf.parse("1997-02-03");
      expect(result.getFullYear()).toBe(1997);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(3);
    });

    it("yyyy/MM/dd parses date with slashes", () => {
      const sdf = new SimpleDateFormat("yyyy/MM/dd");
      const result = sdf.parse("2001/07/04");
      expect(result.getFullYear()).toBe(2001);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(4);
    });

    it("dd-MMM-yyyy parses abbreviated month name", () => {
      const sdf = new SimpleDateFormat("dd-MMM-yyyy");
      const result = sdf.parse("07-Sep-2001");
      expect(result.getFullYear()).toBe(2001);
      expect(result.getMonth()).toBe(8); // September
      expect(result.getDate()).toBe(7);
    });

    it("dd-MMMM-yyyy parses full month name", () => {
      const sdf = new SimpleDateFormat("dd-MMMM-yyyy");
      const result = sdf.parse("07-September-2001");
      expect(result.getFullYear()).toBe(2001);
      expect(result.getMonth()).toBe(8);
      expect(result.getDate()).toBe(7);
    });
  });

  describe("parse - time patterns", () => {
    it("HH:mm:ss parses 24-hour time", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      const result = sdf.parse("2001-07-04 15:08:56");
      expect(result.getHours()).toBe(15);
      expect(result.getMinutes()).toBe(8);
      expect(result.getSeconds()).toBe(56);
    });

    it("hh:mm:ss a parses 12-hour time with AM", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
      const result = sdf.parse("2001-07-04 10:42:28 AM");
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(42);
      expect(result.getSeconds()).toBe(28);
    });

    it("hh:mm:ss a parses 12-hour time with PM", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
      const result = sdf.parse("2001-07-04 02:30:00 PM");
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(0);
    });

    it("hh:mm a parses 12:xx PM as noon", () => {
      const sdf = new SimpleDateFormat("hh:mm a");
      const result = sdf.parse("12:08 PM");
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(8);
    });

    it("hh:mm a parses 12:xx AM as midnight", () => {
      const sdf = new SimpleDateFormat("hh:mm a");
      const result = sdf.parse("12:00 AM");
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });
  });

  describe("parse - 2-digit year", () => {
    it("yy parses 2-digit year >= 80 as 1900s", () => {
      const sdf = new SimpleDateFormat("MM/dd/yy");
      const result = sdf.parse("12/25/99");
      expect(result.getFullYear()).toBe(1999);
    });

    it("yy parses 2-digit year < 80 as 2000s", () => {
      const sdf = new SimpleDateFormat("MM/dd/yy");
      const result = sdf.parse("12/25/01");
      expect(result.getFullYear()).toBe(2001);
    });

    it("yyyy parses 4-digit year with 2-digit pattern in extended form", () => {
      const sdf = new SimpleDateFormat("d/MMM/yy");
      const result = sdf.parse("7/Sep/2001");
      expect(result.getFullYear()).toBe(2001);
      expect(result.getMonth()).toBe(8);
      expect(result.getDate()).toBe(7);
    });
  });

  describe("parse - milliseconds", () => {
    it("SSS parses 3-digit milliseconds", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
      const result = sdf.parse("2001-07-04 12:08:56.235");
      expect(result.getMilliseconds()).toBe(235);
    });

    it("SSS parses padded milliseconds", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
      const result = sdf.parse("2001-07-04 12:08:56.012");
      expect(result.getMilliseconds()).toBe(12);
    });
  });

  describe("parse - day of week", () => {
    it("E is parsed but does not affect date calculation", () => {
      const sdf = new SimpleDateFormat("EEE, dd-MMM-yyyy");
      const result = sdf.parse("Wed, 04-Jul-2001");
      expect(result.getFullYear()).toBe(2001);
      expect(result.getMonth()).toBe(6);
      expect(result.getDate()).toBe(4);
    });

    it("EEEE parses full day name", () => {
      const sdf = new SimpleDateFormat("EEEE, dd-MMM-yyyy");
      const result = sdf.parse("Wednesday, 04-Jul-2001");
      expect(result.getFullYear()).toBe(2001);
      expect(result.getMonth()).toBe(6);
      expect(result.getDate()).toBe(4);
    });
  });

  describe("parse - leniency", () => {
    it("non-lenient parse rejects invalid structure", () => {
      const sdf = new SimpleDateFormat("dd-MM-yyyy");
      sdf.lenient = false;
      expect(() => sdf.parse("50-2-13")).toThrow("Unparseable date: 50-2-13");
    });

    it("non-lenient parse rejects invalid calendar date", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      sdf.lenient = false;
      expect(() => sdf.parse("2001-02-30")).toThrow("Unparseable date: 2001-02-30");
    });

    it("lenient parse normalizes invalid calendar date", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      const parsed = sdf.parse("2001-02-30");
      expect(sdf.format(parsed)).toBe("2001-03-02");
    });
  });

  describe("format-parse round trip", () => {
    it("yyyy-MM-dd round trips correctly", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      const original = localDate(1997, 2, 3);
      const formatted = sdf.format(original);
      const parsed = sdf.parse(formatted);
      expect(sdf.format(parsed)).toBe(formatted);
    });

    it("yyyy-MM-dd HH:mm:ss round trips correctly", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      const original = localDate(2001, 7, 4, 15, 8, 56);
      const formatted = sdf.format(original);
      const parsed = sdf.parse(formatted);
      expect(parsed.getFullYear()).toBe(original.getFullYear());
      expect(parsed.getMonth()).toBe(original.getMonth());
      expect(parsed.getDate()).toBe(original.getDate());
      expect(parsed.getHours()).toBe(original.getHours());
      expect(parsed.getMinutes()).toBe(original.getMinutes());
      expect(parsed.getSeconds()).toBe(original.getSeconds());
    });

    it("yyyy-MM-dd HH:mm:ss.SSS round trips correctly", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
      const original = localDate(2001, 7, 4, 12, 8, 56, 235);
      const formatted = sdf.format(original);
      const parsed = sdf.parse(formatted);
      expect(parsed.getMilliseconds()).toBe(original.getMilliseconds());
    });

    it("dd-MMM-yyyy round trips correctly", () => {
      const sdf = new SimpleDateFormat("dd-MMM-yyyy");
      const original = localDate(2001, 9, 7);
      const formatted = sdf.format(original);
      expect(formatted).toBe("07-Sep-2001");
      const parsed = sdf.parse(formatted);
      expect(parsed.getFullYear()).toBe(2001);
      expect(parsed.getMonth()).toBe(8);
      expect(parsed.getDate()).toBe(7);
    });

    it("h:mm a round trips correctly", () => {
      const sdf = new SimpleDateFormat("h:mm a");
      const original = localDate(2001, 7, 4, 12, 8);
      const formatted = sdf.format(original);
      expect(formatted).toBe("12:08 PM");
      const parsed = sdf.parse(formatted);
      expect(parsed.getHours()).toBe(12);
      expect(parsed.getMinutes()).toBe(8);
    });

    it("yyMMdd round trips correctly", () => {
      const sdf = new SimpleDateFormat("yyMMdd");
      const original = localDate(1997, 3, 4);
      const formatted = sdf.format(original);
      expect(formatted).toBe("970304");
      const parsed = sdf.parse(formatted);
      expect(parsed.getFullYear()).toBe(1997);
      expect(parsed.getMonth()).toBe(2);
      expect(parsed.getDate()).toBe(4);
    });

    it("convergence: format-parse-format stabilizes", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      const original = localDate(2004, 2, 29, 0, 0, 0);
      const s1 = sdf.format(original);
      const d1 = sdf.parse(s1);
      const s2 = sdf.format(d1);
      expect(s1).toBe(s2);
    });
  });

  describe("format - edge cases", () => {
    it("formats leap day correctly", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      expect(sdf.format(localDate(2000, 2, 29))).toBe("2000-02-29");
      expect(sdf.format(localDate(2004, 2, 29))).toBe("2004-02-29");
    });

    it("formats first second of year", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      expect(sdf.format(localDate(1999, 1, 1, 0, 0, 0))).toBe(
        "1999-01-01 00:00:00",
      );
    });

    it("formats last second of year", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      expect(sdf.format(localDate(1999, 12, 31, 23, 59, 59))).toBe(
        "1999-12-31 23:59:59",
      );
    });

    it("formats midnight correctly", () => {
      const sdf = new SimpleDateFormat("HH:mm:ss");
      expect(sdf.format(localDate(2001, 1, 1, 0, 0, 0))).toBe("00:00:00");
    });

    it("formats noon correctly", () => {
      const sdf = new SimpleDateFormat("hh:mm:ss a");
      expect(sdf.format(localDate(2001, 1, 1, 12, 0, 0))).toBe("12:00:00 PM");
    });

    it("formats midnight in 12-hour format", () => {
      const sdf = new SimpleDateFormat("hh:mm:ss a");
      expect(sdf.format(localDate(2001, 1, 1, 0, 0, 0))).toBe("12:00:00 AM");
    });
  });

  describe("applyPattern changes formatting", () => {
    it("format changes after applyPattern", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      const date = localDate(2001, 7, 4);
      expect(sdf.format(date)).toBe("2001-07-04");

      sdf.applyPattern("dd/MM/yyyy");
      expect(sdf.format(date)).toBe("04/07/2001");
    });

    it("parse changes after applyPattern", () => {
      const sdf = new SimpleDateFormat("yyyy-MM-dd");
      const d1 = sdf.parse("2001-07-04");

      sdf.applyPattern("dd/MM/yyyy");
      const d2 = sdf.parse("04/07/2001");

      expect(d1.getFullYear()).toBe(d2.getFullYear());
      expect(d1.getMonth()).toBe(d2.getMonth());
      expect(d1.getDate()).toBe(d2.getDate());
    });
  });

  describe("all months format and parse correctly", () => {
    const months = [
      { num: 1, short: "Jan", long: "January" },
      { num: 2, short: "Feb", long: "February" },
      { num: 3, short: "Mar", long: "March" },
      { num: 4, short: "Apr", long: "April" },
      { num: 5, short: "May", long: "May" },
      { num: 6, short: "Jun", long: "June" },
      { num: 7, short: "Jul", long: "July" },
      { num: 8, short: "Aug", long: "August" },
      { num: 9, short: "Sep", long: "September" },
      { num: 10, short: "Oct", long: "October" },
      { num: 11, short: "Nov", long: "November" },
      { num: 12, short: "Dec", long: "December" },
    ];

    it.each(months)(
      "MMM formats and parses $short correctly",
      ({ num, short: abbr }) => {
        const sdf = new SimpleDateFormat("dd-MMM-yyyy");
        const date = localDate(2001, num, 15);
        const formatted = sdf.format(date);
        expect(formatted).toContain(abbr);
        const parsed = sdf.parse(formatted);
        expect(parsed.getMonth()).toBe(num - 1);
      },
    );

    it.each(months)(
      "MMMM formats and parses $long correctly",
      ({ num, long: full }) => {
        const sdf = new SimpleDateFormat("dd-MMMM-yyyy");
        const date = localDate(2001, num, 15);
        const formatted = sdf.format(date);
        expect(formatted).toContain(full);
        const parsed = sdf.parse(formatted);
        expect(parsed.getMonth()).toBe(num - 1);
      },
    );
  });

  describe("all days of week format correctly", () => {
    // 2001-07-01 is Sunday, 2001-07-02 is Monday, ...
    const days = [
      { date: 1, short: "Sun", long: "Sunday" },
      { date: 2, short: "Mon", long: "Monday" },
      { date: 3, short: "Tue", long: "Tuesday" },
      { date: 4, short: "Wed", long: "Wednesday" },
      { date: 5, short: "Thu", long: "Thursday" },
      { date: 6, short: "Fri", long: "Friday" },
      { date: 7, short: "Sat", long: "Saturday" },
    ];

    it.each(days)("E formats $short correctly", ({ date, short: abbr }) => {
      const sdf = new SimpleDateFormat("E");
      expect(sdf.format(localDate(2001, 7, date))).toBe(abbr);
    });

    it.each(days)(
      "EEEE formats $long correctly",
      ({ date, long: full }) => {
        const sdf = new SimpleDateFormat("EEEE");
        expect(sdf.format(localDate(2001, 7, date))).toBe(full);
      },
    );
  });

  describe("millisecond format patterns", () => {
    it("S formats 456ms as 456", () => {
      const sdf = new SimpleDateFormat("s.S");
      const date = localDate(2001, 1, 1, 0, 0, 1, 456);
      expect(sdf.format(date)).toBe("1.456");
    });

    it("SS formats 12ms as 12", () => {
      const sdf = new SimpleDateFormat("s.SS");
      const date = localDate(2001, 1, 1, 0, 0, 1, 12);
      expect(sdf.format(date)).toBe("1.12");
    });

    it("SSS formats 12ms as 012", () => {
      const sdf = new SimpleDateFormat("s.SSS");
      const date = localDate(2001, 1, 1, 0, 0, 1, 12);
      expect(sdf.format(date)).toBe("1.012");
    });

    it("SSSS formats 12ms as 0012", () => {
      const sdf = new SimpleDateFormat("s.SSSS");
      const date = localDate(2001, 1, 1, 0, 0, 1, 12);
      expect(sdf.format(date)).toBe("1.0012");
    });
  });
});
