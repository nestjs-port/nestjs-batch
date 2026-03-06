export interface LineMapper<T> {
  mapLine(line: string, lineNumber: number): T;
}
