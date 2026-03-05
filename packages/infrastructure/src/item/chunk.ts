export class Chunk<W> implements Iterable<W> {
  private readonly _items: W[] = [];

  constructor(items: W[] | null = null) {
    if (items) {
      this._items.push(...items);
    }
  }

  static of<W>(...items: W[]): Chunk<W> {
    return new Chunk(items);
  }

  add(item: W): void {
    this._items.push(item);
  }

  addAll(items: W[]): void {
    this._items.push(...items);
  }

  clear(): void {
    this._items.length = 0;
  }

  get items(): readonly W[] {
    return Object.freeze([...this._items]);
  }

  get isEmpty(): boolean {
    return this._items.length === 0;
  }

  get size(): number {
    return this._items.length;
  }

  [Symbol.iterator](): Iterator<W> {
    return this._items[Symbol.iterator]();
  }
}
