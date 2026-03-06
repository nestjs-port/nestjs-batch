import type { LineMapper } from "../line-mapper";

export class PassThroughLineMapper implements LineMapper<string> {
  mapLine(line: string, _lineNumber: number): string {
    return line;
  }
}
