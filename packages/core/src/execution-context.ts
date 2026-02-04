/**
 * Object representing a context for an ItemStream. It is a thin wrapper for a
 * map that allows optionally for type safety on reads. It also allows for dirty
 * checking by setting a 'dirty' flag whenever any put is called.
 */
export class ExecutionContext {
  private _dirty = false;
  private readonly _map: Map<string, unknown>;

  /**
   * Default constructor. Initializes a new execution context with an empty map.
   */
  constructor();

  /**
   * Initializes a new execution context with the contents of another map.
   * @param map - initial contents of context
   */
  constructor(map: Map<string, unknown>);

  /**
   * Initializes a new execution context with the contents of another ExecutionContext.
   * @param executionContext - context to copy from
   */
  constructor(executionContext: ExecutionContext);

  constructor(arg?: Map<string, unknown> | ExecutionContext) {
    if (arg instanceof ExecutionContext) {
      this._map = new Map(arg._map);
    } else if (arg instanceof Map) {
      this._map = new Map(arg);
    } else {
      this._map = new Map();
    }
  }

  /**
   * Adds a string value to the context.
   * @param key - key to add
   * @param value - value to associate with key
   */
  putString(key: string, value: string | null): void {
    this.put(key, value);
  }

  /**
   * Adds a number value to the context.
   * @param key - key to add
   * @param value - value to associate with key
   */
  putNumber(key: string, value: number): void {
    this.put(key, value);
  }

  /**
   * Add an object value to the context.
   * @param key - key to add
   * @param value - value to associate with key (null removes the key)
   */
  put(key: string, value: unknown): void {
    if (value !== null && value !== undefined) {
      const result = this._map.get(key);
      this._map.set(key, value);
      this._dirty = this._dirty || result === undefined || result !== value;
    } else {
      const result = this._map.get(key);
      this._map.delete(key);
      this._dirty = this._dirty || result !== undefined;
    }
  }

  /**
   * Indicates if context has been changed with a "put" operation.
   * @returns true if dirty
   */
  get isDirty(): boolean {
    return this._dirty;
  }

  /**
   * Typesafe getter for a string value.
   * @param key - the key to get
   * @returns the string value
   */
  getString(key: string): string;
  getString(key: string, defaultValue: string): string;
  getString(key: string, defaultValue?: string): string {
    if (!this.containsKey(key)) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Key not found: ${key}`);
    }
    const value = this._map.get(key);
    if (typeof value !== 'string') {
      throw new TypeError(`Value for key=${key} is not a string`);
    }
    return value;
  }

  /**
   * Typesafe getter for a number value.
   * @param key - the key to get
   * @returns the number value
   */
  getNumber(key: string): number;
  getNumber(key: string, defaultValue: number): number;
  getNumber(key: string, defaultValue?: number): number {
    if (!this.containsKey(key)) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Key not found: ${key}`);
    }
    const value = this._map.get(key);
    if (typeof value !== 'number') {
      throw new TypeError(`Value for key=${key} is not a number`);
    }
    return value;
  }

  /**
   * Getter for the value represented by the provided key.
   * @param key - the key to get
   * @returns the value or undefined
   */
  get(key: string): unknown {
    return this._map.get(key);
  }

  /**
   * Indicates whether or not the context is empty.
   * @returns true if empty
   */
  get isEmpty(): boolean {
    return this._map.size === 0;
  }

  /**
   * Clears the dirty flag.
   */
  clearDirtyFlag(): void {
    this._dirty = false;
  }

  /**
   * Returns the internal map as read-only.
   * @returns an unmodifiable map
   */
  toMap(): Map<string, unknown> {
    return new Map(this._map);
  }

  /**
   * Indicates whether or not a key is represented.
   * @param key - key to check
   * @returns true if key exists
   */
  containsKey(key: string): boolean {
    return this._map.has(key);
  }

  /**
   * Removes the mapping for a key.
   * @param key - key to remove
   * @returns the removed value
   */
  remove(key: string): unknown {
    const value = this._map.get(key);
    this._map.delete(key);
    return value;
  }

  /**
   * Indicates whether or not a value is represented.
   * @param value - value to check
   * @returns true if value exists
   */
  containsValue(value: unknown): boolean {
    for (const v of this._map.values()) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns number of entries in the context.
   * @returns the size
   */
  get size(): number {
    return this._map.size;
  }

  toString(): string {
    return JSON.stringify(Object.fromEntries(this._map));
  }
}
