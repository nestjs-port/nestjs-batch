import type { LineMapper } from "../line-mapper.js";

export class JsonLineMapper implements LineMapper<Record<string, unknown>> {
  mapLine(line: string, _lineNumber: number): Record<string, unknown> {
    return JSON.parse(line) as Record<string, unknown>;
  }
}
