import { DateFormat } from "./date-format.js";

interface PatternToken {
  type: "field" | "literal";
  value: string;
}

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export class SimpleDateFormat extends DateFormat {
  private _pattern: string;

  constructor(pattern: string) {
    super();
    this._pattern = pattern;
  }

  get pattern(): string {
    return this._pattern;
  }

  applyPattern(pattern: string): void {
    this._pattern = pattern;
  }

  toPattern(): string {
    return this._pattern;
  }

  format(date: Date): string {
    const tokens = this.compilePattern(this._pattern);
    let result = "";

    for (const token of tokens) {
      if (token.type === "literal") {
        result += token.value;
      } else {
        result += this.formatField(date, token.value);
      }
    }

    return result;
  }

  parse(source: string): Date {
    const tokens = this.compilePattern(this._pattern);
    let pos = 0;

    let year = 1970;
    let month = 0;
    let day = 1;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let millis = 0;
    let amPm = -1;
    let isHour12 = false;

    for (let ti = 0; ti < tokens.length; ti++) {
      const token = tokens[ti];
      if (token.type === "literal") {
        // skip matching literal characters
        pos += token.value.length;
        continue;
      }

      const ch = token.value[0];
      const count = token.value.length;

      // Java's obeyCount: when the next token is also a numeric field
      // with no separator, read exactly `count` digits
      const obeyCount = this.isNextTokenNumericField(tokens, ti);

      switch (ch) {
        case "y": {
          const str = obeyCount
            ? source.substring(pos, pos + count)
            : this.extractNumber(source, pos, count);
          let val = Number.parseInt(str, 10);
          if (count === 2 && str.length <= 2) {
            val += val < 80 ? 2000 : 1900;
          }
          year = val;
          pos += str.length;
          break;
        }
        case "M": {
          if (count >= 3) {
            // text month
            const names = count >= 4 ? MONTHS_LONG : MONTHS_SHORT;
            const found = names.findIndex((n) =>
              source.substring(pos).startsWith(n),
            );
            if (found >= 0) {
              month = found;
              pos += names[found].length;
            }
          } else {
            const str = obeyCount
              ? source.substring(pos, pos + count)
              : this.extractNumber(source, pos, count);
            month = Number.parseInt(str, 10) - 1;
            pos += str.length;
          }
          break;
        }
        case "d": {
          const str = obeyCount
            ? source.substring(pos, pos + count)
            : this.extractNumber(source, pos, count);
          day = Number.parseInt(str, 10);
          pos += str.length;
          break;
        }
        case "H": {
          const str = obeyCount
            ? source.substring(pos, pos + count)
            : this.extractNumber(source, pos, count);
          hour = Number.parseInt(str, 10);
          pos += str.length;
          break;
        }
        case "h": {
          isHour12 = true;
          const str = obeyCount
            ? source.substring(pos, pos + count)
            : this.extractNumber(source, pos, count);
          hour = Number.parseInt(str, 10);
          pos += str.length;
          break;
        }
        case "m": {
          const str = obeyCount
            ? source.substring(pos, pos + count)
            : this.extractNumber(source, pos, count);
          minute = Number.parseInt(str, 10);
          pos += str.length;
          break;
        }
        case "s": {
          const str = obeyCount
            ? source.substring(pos, pos + count)
            : this.extractNumber(source, pos, count);
          second = Number.parseInt(str, 10);
          pos += str.length;
          break;
        }
        case "S": {
          const str = obeyCount
            ? source.substring(pos, pos + count)
            : this.extractNumber(source, pos, count);
          millis = Number.parseInt(str, 10);
          pos += str.length;
          break;
        }
        case "a": {
          if (source.substring(pos, pos + 2).toUpperCase() === "PM") {
            amPm = 1;
          } else {
            amPm = 0;
          }
          pos += 2;
          break;
        }
        case "E": {
          const names = count >= 4 ? DAYS_LONG : DAYS_SHORT;
          const found = names.find((n) => source.substring(pos).startsWith(n));
          if (found) {
            pos += found.length;
          }
          break;
        }
        default: {
          // skip unknown fields by count
          pos += count;
          break;
        }
      }
    }

    if (isHour12 && amPm === 1 && hour !== 12) {
      hour += 12;
    } else if (isHour12 && amPm === 0 && hour === 12) {
      hour = 0;
    }

    const parsed = new Date(year, month, day, hour, minute, second, millis);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Unparseable date: ${source}`);
    }

    if (!this.lenient && this.format(parsed) !== source) {
      throw new Error(`Unparseable date: ${source}`);
    }

    return parsed;
  }

  private compilePattern(pattern: string): PatternToken[] {
    const tokens: PatternToken[] = [];
    const len = pattern.length;
    let i = 0;

    while (i < len) {
      const c = pattern[i];

      if (c === "'") {
        // quoted literal
        i++;
        if (i < len && pattern[i] === "'") {
          // '' → single quote literal
          tokens.push({ type: "literal", value: "'" });
          i++;
        } else {
          let literal = "";
          while (i < len && pattern[i] !== "'") {
            literal += pattern[i];
            i++;
          }
          if (i < len) {
            i++; // skip closing quote
          }
          tokens.push({ type: "literal", value: literal });
        }
      } else if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
        // field pattern: collect consecutive same characters
        let field = c;
        i++;
        while (i < len && pattern[i] === c) {
          field += c;
          i++;
        }
        tokens.push({ type: "field", value: field });
      } else {
        // non-letter literal
        tokens.push({ type: "literal", value: c });
        i++;
      }
    }

    return tokens;
  }

  private static readonly NUMERIC_FIELDS = new Set([
    "y",
    "Y",
    "M",
    "L",
    "d",
    "D",
    "H",
    "h",
    "k",
    "K",
    "m",
    "s",
    "S",
    "w",
    "W",
    "F",
    "u",
  ]);

  private isNextTokenNumericField(
    tokens: PatternToken[],
    currentIndex: number,
  ): boolean {
    for (let i = currentIndex + 1; i < tokens.length; i++) {
      const next = tokens[i];
      if (next.type === "literal") {
        // a literal separator means we don't need to obey count
        return false;
      }
      if (next.type === "field") {
        const ch = next.value[0];
        // text fields (E, a, G, z, Z, X) are not numeric
        return SimpleDateFormat.NUMERIC_FIELDS.has(ch) && next.value.length < 3;
      }
    }
    return false;
  }

  private formatField(date: Date, field: string): string {
    const ch = field[0];
    const count = field.length;

    switch (ch) {
      case "G": // era
        return "AD";
      case "y": // year
      case "Y": {
        const year = date.getFullYear();
        if (count === 2) {
          return this.pad(year % 100, 2);
        }
        return this.pad(year, count);
      }
      case "M": // month
      case "L": {
        const month = date.getMonth();
        if (count >= 4) {
          return MONTHS_LONG[month];
        }
        if (count === 3) {
          return MONTHS_SHORT[month];
        }
        return this.pad(month + 1, count);
      }
      case "w": // week of year (simplified)
        return this.pad(this.weekOfYear(date), count);
      case "d": // day of month
        return this.pad(date.getDate(), count);
      case "D": {
        // day of year
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = Math.floor((date.getTime() - start.getTime()) / 86400000);
        return this.pad(diff + 1, count);
      }
      case "E": {
        // day of week
        const dow = date.getDay();
        return count >= 4 ? DAYS_LONG[dow] : DAYS_SHORT[dow];
      }
      case "u": {
        // day number of week (1=Mon, 7=Sun)
        const d = date.getDay();
        return String(d === 0 ? 7 : d);
      }
      case "a": // AM/PM
        return date.getHours() < 12 ? "AM" : "PM";
      case "H": // hour (0-23)
        return this.pad(date.getHours(), count);
      case "k": {
        // hour (1-24)
        const h = date.getHours();
        return this.pad(h === 0 ? 24 : h, count);
      }
      case "K": // hour in am/pm (0-11)
        return this.pad(date.getHours() % 12, count);
      case "h": {
        // hour in am/pm (1-12)
        const h = date.getHours() % 12;
        return this.pad(h === 0 ? 12 : h, count);
      }
      case "m": // minute
        return this.pad(date.getMinutes(), count);
      case "s": // second
        return this.pad(date.getSeconds(), count);
      case "S": // millisecond
        return this.pad(date.getMilliseconds(), count);
      case "z": // timezone name (simplified)
        return this.formatTimeZoneName(date);
      case "Z": {
        // timezone offset ("-/+hhmm")
        const offset = -date.getTimezoneOffset();
        const sign = offset >= 0 ? "+" : "-";
        const absOffset = Math.abs(offset);
        return (
          sign +
          this.pad(Math.floor(absOffset / 60), 2) +
          this.pad(absOffset % 60, 2)
        );
      }
      case "X": {
        // ISO 8601 timezone
        const tz = -date.getTimezoneOffset();
        if (tz === 0) {
          return "Z";
        }
        const s = tz >= 0 ? "+" : "-";
        const abs = Math.abs(tz);
        const hh = this.pad(Math.floor(abs / 60), 2);
        const mm = this.pad(abs % 60, 2);
        if (count === 1) {
          return s + hh;
        }
        if (count === 2) {
          return s + hh + mm;
        }
        return `${s + hh}:${mm}`;
      }
      default:
        return field;
    }
  }

  private pad(value: number, length: number): string {
    return String(value).padStart(length, "0");
  }

  private extractNumber(
    source: string,
    pos: number,
    minDigits: number,
  ): string {
    let end = pos;
    while (end < source.length && source[end] >= "0" && source[end] <= "9") {
      end++;
    }
    const str = source.substring(pos, end);
    if (str.length < minDigits) {
      return source.substring(pos, pos + minDigits);
    }
    return str;
  }

  private weekOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.ceil((diff / oneWeek + start.getDay() + 1) / 7);
  }

  private formatTimeZoneName(date: Date): string {
    // Intl.DateTimeFormat provides timezone names when available
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZoneName: "short",
      }).formatToParts(date);
      const tzPart = parts.find((p) => p.type === "timeZoneName");
      if (tzPart) {
        return tzPart.value;
      }
    } catch {
      // fallback
    }
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return (
      "GMT" +
      sign +
      this.pad(Math.floor(abs / 60), 2) +
      ":" +
      this.pad(abs % 60, 2)
    );
  }
}
