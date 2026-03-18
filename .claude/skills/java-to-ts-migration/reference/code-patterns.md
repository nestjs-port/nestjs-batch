# Code Patterns Reference

Use these patterns when migrating Spring Batch Java files to NestJS Batch TypeScript.

## 1. Interface Conversion (ItemReader)

**Java:**
```java
@FunctionalInterface
public interface ItemReader<T> {
    @Nullable T read() throws Exception;
}
```

**TypeScript:**
```typescript
export interface ItemReader<T> {
  read(): Promise<T | null>;
}
```

Key points:
- Remove Java annotations (`@FunctionalInterface`, `@Nullable`).
- Keep generic type parameter.
- Use async-style contract in TS when interface in target package already uses it.

## 2. Record/Class Conversion (JobParameter)

**Java:**
```java
public record JobParameter<T>(
    String name,
    T value,
    Class<T> type,
    boolean identifying
) {
    public JobParameter {
        Assert.notNull(name, "name must not be null");
        Assert.notNull(value, "value must not be null");
        Assert.notNull(type, "type must not be null");
    }
}
```

**TypeScript:**
```typescript
import assert from "node:assert/strict";

export class JobParameter<T = unknown> {
  readonly name: string;
  readonly value: T;
  readonly type: new (...args: never[]) => T;
  readonly identifying: boolean;

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
}
```

Key points:
- Replace `Assert.notNull` with Node strict `assert`.
- Use overload/default parameter patterns when Java has multiple constructors.
- Keep immutable fields as `readonly`.

## 3. Enum Conversion (BatchStatus)

**Java:**
```java
public enum BatchStatus {
    COMPLETED, STARTING, STARTED, STOPPING, STOPPED, FAILED, ABANDONED, UNKNOWN
}
```

**TypeScript:**
```typescript
export enum BatchStatus {
  COMPLETED = "COMPLETED",
  STARTING = "STARTING",
  STARTED = "STARTED",
  STOPPING = "STOPPING",
  STOPPED = "STOPPED",
  FAILED = "FAILED",
  ABANDONED = "ABANDONED",
  UNKNOWN = "UNKNOWN",
}
```

Key points:
- Use string enums to keep JSON/logging output stable.
- Preserve Java enum member names exactly.

## 4. Static Utility Method Conversion

When Java enum/class has static helpers, convert to a companion utility object if needed.

**Java:**
```java
public static BatchStatus max(BatchStatus status1, BatchStatus status2) { ... }
```

**TypeScript:**
```typescript
export const BatchStatusUtils = {
  max(status1: BatchStatus, status2: BatchStatus): BatchStatus {
    return this.isGreaterThan(status1, status2) ? status1 : status2;
  },
  isGreaterThan(status1: BatchStatus, status2: BatchStatus): boolean {
    return STATUS_ORDER.indexOf(status1) > STATUS_ORDER.indexOf(status2);
  },
};
```

## 5. Builder Conversion (JobParametersBuilder)

**Java:**
```java
public class JobParametersBuilder {
    public JobParametersBuilder addString(String name, String value, boolean identifying) { ... }
    public JobParametersBuilder addLong(String name, Long value, boolean identifying) { ... }
    public JobParameters toJobParameters() { ... }
}
```

**TypeScript:**
```typescript
export class JobParametersBuilder {
  addString(name: string, value: string, identifying = true): this { ... }
  addNumber(name: string, value: number, identifying = true): this { ... }
  addDate(name: string, value: Date, identifying = true): this { ... }
  toJobParameters(): JobParameters { ... }
}
```

Key points:
- Keep fluent return type as `this`.
- Map `Long/Double` to `number`.
- Keep default `identifying = true`.

## 6. Import Patterns

Use repository package naming:

```typescript
import type { ItemReader } from "@nestjs-batch/infrastructure";
import { JobParameter } from "./job-parameter";
```

Rules:
- Cross-package: `@nestjs-batch/<package>`.
- Same package: relative imports.
- Type-only symbol: `import type`.

## 7. Java-Specific Methods

Default rule:
- Skip `hashCode()` and `toString()` unless explicitly required.
- Keep `equals` only if the target file in this repository already implements explicit equality semantics (for example `JobParameter.equals`).
