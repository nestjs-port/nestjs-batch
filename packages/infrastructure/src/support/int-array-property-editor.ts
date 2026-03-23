export class IntArrayPropertyEditor {
  private _value: number[] = [];

  setAsText(text: string): void {
    this._value = text.split(",").map((s) => {
      const trimmed = s.trim();
      const parsed = Number.parseInt(trimmed, 10);
      if (Number.isNaN(parsed)) {
        throw new Error(`For input string: "${trimmed}"`);
      }
      return parsed;
    });
  }

  get value(): number[] {
    return this._value;
  }
}
