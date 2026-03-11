/**
 * Utility methods for string operations.
 */
export abstract class StringUtils {
  private constructor() {
    // Utility class
  }

  /**
   * Check whether the given value is a string with at least one non-whitespace
   * character.
   */
  static hasText(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }

  static countOccurrences(value: string, substring: string): number {
    if (substring.length === 0) {
      return 0;
    }

    let count = 0;
    let index = 0;
    while (true) {
      index = value.indexOf(substring, index);
      if (index === -1) {
        break;
      }
      count += 1;
      index += substring.length;
    }
    return count;
  }
}
