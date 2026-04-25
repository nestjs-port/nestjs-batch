import { describe, expect, it } from "vitest";
import { DateFormat } from "../date-format.js";
import { SimpleDateFormat } from "../simple-date-format.js";

describe("DateFormat", () => {
  it("style constants have correct values", () => {
    expect(DateFormat.FULL).toBe(0);
    expect(DateFormat.LONG).toBe(1);
    expect(DateFormat.MEDIUM).toBe(2);
    expect(DateFormat.SHORT).toBe(3);
    expect(DateFormat.DEFAULT).toBe(DateFormat.MEDIUM);
  });

  it("field constants have correct values", () => {
    expect(DateFormat.ERA_FIELD).toBe(0);
    expect(DateFormat.YEAR_FIELD).toBe(1);
    expect(DateFormat.MONTH_FIELD).toBe(2);
    expect(DateFormat.DATE_FIELD).toBe(3);
    expect(DateFormat.HOUR_OF_DAY1_FIELD).toBe(4);
    expect(DateFormat.HOUR_OF_DAY0_FIELD).toBe(5);
    expect(DateFormat.MINUTE_FIELD).toBe(6);
    expect(DateFormat.SECOND_FIELD).toBe(7);
    expect(DateFormat.MILLISECOND_FIELD).toBe(8);
    expect(DateFormat.DAY_OF_WEEK_FIELD).toBe(9);
    expect(DateFormat.DAY_OF_YEAR_FIELD).toBe(10);
    expect(DateFormat.DAY_OF_WEEK_IN_MONTH_FIELD).toBe(11);
    expect(DateFormat.WEEK_OF_YEAR_FIELD).toBe(12);
    expect(DateFormat.WEEK_OF_MONTH_FIELD).toBe(13);
    expect(DateFormat.AM_PM_FIELD).toBe(14);
    expect(DateFormat.HOUR1_FIELD).toBe(15);
    expect(DateFormat.HOUR0_FIELD).toBe(16);
    expect(DateFormat.TIMEZONE_FIELD).toBe(17);
  });

  it("lenient defaults to true", () => {
    const fmt = new SimpleDateFormat("yyyy-MM-dd");
    expect(fmt.lenient).toBe(true);
  });

  it("lenient can be set", () => {
    const fmt = new SimpleDateFormat("yyyy-MM-dd");
    fmt.lenient = false;
    expect(fmt.lenient).toBe(false);
  });

  it("timeZone defaults to undefined", () => {
    const fmt = new SimpleDateFormat("yyyy-MM-dd");
    expect(fmt.timeZone).toBeUndefined();
  });

  it("timeZone can be set", () => {
    const fmt = new SimpleDateFormat("yyyy-MM-dd");
    fmt.timeZone = "America/New_York";
    expect(fmt.timeZone).toBe("America/New_York");
  });

  it("SimpleDateFormat is instance of DateFormat", () => {
    const fmt = new SimpleDateFormat("yyyy-MM-dd");
    expect(fmt).toBeInstanceOf(DateFormat);
  });
});
