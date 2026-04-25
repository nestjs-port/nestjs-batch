/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
