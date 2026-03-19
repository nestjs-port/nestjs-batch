export class IntArrayPropertyEditor {
  private _value: number[] = [];

  setAsText(text: string): void {
    this._value = text
      .split(",")
      .map((s) => Number.parseInt(s.trim(), 10));
  }

  get value(): number[] {
    return this._value;
  }
}
