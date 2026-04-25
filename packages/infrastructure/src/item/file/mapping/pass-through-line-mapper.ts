import type { LineMapper } from "../line-mapper.js";

export class PassThroughLineMapper implements LineMapper<string> {
  mapLine(line: string, _lineNumber: number): string {
    return line;
  }
}
