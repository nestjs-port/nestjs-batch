# Test Migration (JUnit -> Vitest)

## Critical Rules

1. Preserve test intent and assertion semantics.
2. Keep Java test method names as space-separated `it(...)` labels.
3. Do not add new test cases unless explicitly requested.

## Name Conversion

Convert camelCase method names to lowercase words:

- `testConstructorNameNotNull` -> `"test constructor name not null"`
- `testDateParameter` -> `"test date parameter"`

Do not prepend "should" or rewrite wording.

## Structure Mapping

**Java (from `JobParameterTests`):**
```java
class JobParameterTests {
    @Test
    void testConstructorNameNotNull() { ... }

    @Test
    void testStringParameter() { ... }
}
```

**TypeScript:**
```typescript
import { describe, expect, it } from "vitest";
import { JobParameter } from "../job-parameter";

describe("JobParameter", () => {
  it("test constructor name not null", () => { ... });
  it("test string parameter", () => { ... });
});
```

## Assertion Mapping

| JUnit / AssertJ (Java) | Vitest (TypeScript) |
|---|---|
| `assertEquals(a, b)` | `expect(a).toBe(b)` |
| `assertTrue(x)` | `expect(x).toBe(true)` |
| `assertFalse(x)` | `expect(x).toBe(false)` |
| `assertNull(x)` | `expect(x).toBeNull()` |
| `assertNotNull(x)` | `expect(x).not.toBeNull()` |
| `assertThrows(E.class, () -> ...)` | `expect(() => ...).toThrow(...)` |
| object equality | `expect(a).toEqual(b)` |

Use `toEqual` for objects/arrays/maps and `toBe` for primitives/reference identity.

## Setup/Teardown Mapping

**Java:**
```java
@BeforeEach
void setUp() { ... }

@AfterEach
void tearDown() { ... }
```

**TypeScript:**
```typescript
import { beforeEach, afterEach } from "vitest";

beforeEach(() => { ... });
afterEach(() => { ... });
```

## Parameterized Tests

**Java:**
```java
@ParameterizedTest
@ValueSource(strings = {"A", "B"})
void testValue(String value) { ... }
```

**TypeScript:**
```typescript
it.each(["A", "B"])("test value: %s", (value) => { ... });
```

## Verification Commands

Run from `nestjs-batch/`:

```bash
pnpm --filter @nestjs-batch/core test
pnpm --filter @nestjs-batch/infrastructure test
pnpm --filter @nestjs-batch/platform test
```
