export interface FieldSet {
  get names(): string[];

  hasNames(): boolean;

  get values(): string[];

  readString(index: number): string | null;
  readString(name: string): string | null;

  readRawString(index: number): string | null;
  readRawString(name: string): string | null;

  readBoolean(index: number): boolean;
  readBoolean(name: string): boolean;
  readBoolean(index: number, trueValue: string): boolean;
  readBoolean(name: string, trueValue: string): boolean;

  readChar(index: number): string;
  readChar(name: string): string;

  readByte(index: number): number;
  readByte(name: string): number;

  readShort(index: number): number;
  readShort(name: string): number;

  readInt(index: number): number;
  readInt(name: string): number;
  readInt(index: number, defaultValue: number): number;
  readInt(name: string, defaultValue: number): number;

  readLong(index: number): number;
  readLong(name: string): number;
  readLong(index: number, defaultValue: number): number;
  readLong(name: string, defaultValue: number): number;

  readFloat(index: number): number;
  readFloat(name: string): number;

  readDouble(index: number): number;
  readDouble(name: string): number;

  readBigDecimal(index: number): number | null;
  readBigDecimal(name: string): number | null;
  readBigDecimal(index: number, defaultValue: number): number | null;
  readBigDecimal(name: string, defaultValue: number): number | null;

  readDate(index: number): Date;
  readDate(name: string): Date;
  readDate(index: number, defaultValue: Date): Date;
  readDate(name: string, defaultValue: Date): Date;
  readDate(index: number, pattern: string): Date;
  readDate(name: string, pattern: string): Date;
  readDate(index: number, pattern: string, defaultValue: Date): Date;
  readDate(name: string, pattern: string, defaultValue: Date): Date;

  get fieldCount(): number;

  get properties(): Record<string, string>;
}
