import assert from "node:assert/strict";

export class PatternMatcher<S> {
  private readonly map: Map<string, S>;
  private readonly sorted: string[];

  constructor(map: Map<string, S>) {
    this.map = map;
    // Sort keys to start with the most specific
    this.sorted = [...map.keys()].sort((a, b) => (b > a ? 1 : b < a ? -1 : 0));
  }

  static match(pattern: string, str: string): boolean {
    let patIdxStart = 0;
    let patIdxEnd = pattern.length - 1;
    let strIdxStart = 0;
    let strIdxEnd = str.length - 1;
    let ch: string;

    const containsStar = pattern.includes("*");

    if (!containsStar) {
      // No '*'s, so we make a shortcut
      if (patIdxEnd !== strIdxEnd) {
        return false; // Pattern and string do not have the same size
      }
      for (let i = 0; i <= patIdxEnd; i++) {
        ch = pattern[i];
        if (ch !== "?") {
          if (ch !== str[i]) {
            return false; // Character mismatch
          }
        }
      }
      return true; // String matches against pattern
    }

    if (patIdxEnd === 0) {
      return true; // Pattern contains only '*', which matches anything
    }

    // Process characters before first star
    while ((ch = pattern[patIdxStart]) !== "*" && strIdxStart <= strIdxEnd) {
      if (ch !== "?") {
        if (ch !== str[strIdxStart]) {
          return false; // Character mismatch
        }
      }
      patIdxStart++;
      strIdxStart++;
    }
    if (strIdxStart > strIdxEnd) {
      // All characters in the string are used. Check if only '*'s are
      // left in the pattern. If so, we succeeded. Otherwise failure.
      for (let i = patIdxStart; i <= patIdxEnd; i++) {
        if (pattern[i] !== "*") {
          return false;
        }
      }
      return true;
    }

    // Process characters after last star
    while ((ch = pattern[patIdxEnd]) !== "*" && strIdxStart <= strIdxEnd) {
      if (ch !== "?") {
        if (ch !== str[strIdxEnd]) {
          return false; // Character mismatch
        }
      }
      patIdxEnd--;
      strIdxEnd--;
    }
    if (strIdxStart > strIdxEnd) {
      // All characters in the string are used. Check if only '*'s are
      // left in the pattern. If so, we succeeded. Otherwise failure.
      for (let i = patIdxStart; i <= patIdxEnd; i++) {
        if (pattern[i] !== "*") {
          return false;
        }
      }
      return true;
    }

    // process pattern between stars. patIdxStart and patIdxEnd point
    // always to a '*'.
    while (patIdxStart !== patIdxEnd && strIdxStart <= strIdxEnd) {
      let patIdxTmp = -1;
      for (let i = patIdxStart + 1; i <= patIdxEnd; i++) {
        if (pattern[i] === "*") {
          patIdxTmp = i;
          break;
        }
      }
      if (patIdxTmp === patIdxStart + 1) {
        // Two stars next to each other, skip the first one.
        patIdxStart++;
        continue;
      }
      // Find the pattern between patIdxStart & patIdxTmp in str between
      // strIdxStart & strIdxEnd
      const patLength = patIdxTmp - patIdxStart - 1;
      const strLength = strIdxEnd - strIdxStart + 1;
      let foundIdx = -1;
      strLoop: for (let i = 0; i <= strLength - patLength; i++) {
        for (let j = 0; j < patLength; j++) {
          ch = pattern[patIdxStart + j + 1];
          if (ch !== "?") {
            if (ch !== str[strIdxStart + i + j]) {
              continue strLoop;
            }
          }
        }
        foundIdx = strIdxStart + i;
        break;
      }

      if (foundIdx === -1) {
        return false;
      }

      patIdxStart = patIdxTmp;
      strIdxStart = foundIdx + patLength;
    }

    // All characters in the string are used. Check if only '*'s are left
    // in the pattern. If so, we succeeded. Otherwise failure.
    for (let i = patIdxStart; i <= patIdxEnd; i++) {
      if (pattern[i] !== "*") {
        return false;
      }
    }

    return true;
  }

  match(line: string): S {
    assert(line != null, "A non-null key must be provided to match against.");

    for (const key of this.sorted) {
      if (PatternMatcher.match(key, line)) {
        return this.map.get(key) as S;
      }
    }

    throw new Error(`Could not find a matching pattern for key=[${line}]`);
  }
}
