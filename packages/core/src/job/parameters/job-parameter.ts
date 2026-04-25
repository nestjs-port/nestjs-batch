import assert from "node:assert/strict";

export class JobParameter<T = unknown> {
  readonly name: string;

  readonly value: T;

  readonly type: new (...args: never[]) => T;

  readonly identifying: boolean;

  constructor(name: string, value: T, type: new (...args: never[]) => T);
  constructor(
    name: string,
    value: T,
    type: new (...args: never[]) => T,
    identifying: boolean,
  );
  constructor(
    name: string,
    value: T,
    type: new (...args: never[]) => T,
    identifying = true,
  ) {
    assert(name != null, "name must not be null");
    assert(value != null, "value must not be null");
    assert(type != null, "type must not be null");
    this.name = name;
    this.value = value;
    this.type = type;
    this.identifying = identifying;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof JobParameter)) return false;
    return this.name === other.name;
  }
}
