# Documentation Migration (Javadoc → JSDoc)

## Core Rule: Only Migrate Comments Inside Method Bodies

**Critical:** Only migrate comments that exist **inside method/function bodies** (inline comments). Do NOT migrate any of the following:

- **License headers** — managed at the repository level, not per file
- **Class/Interface Javadoc** — do not migrate to JSDoc
- **Method/Constructor Javadoc** — do not migrate to JSDoc
- **Field Javadoc** — do not migrate to JSDoc

The only comments that should be carried over are `//` or `/* */` comments that appear **within** a method body to explain implementation logic.

## Examples: What to Drop

**Java (class-level Javadoc - do NOT migrate):**
```java
/**
 * The Prompt class represents a prompt used in AI model requests. A prompt consists of
 * one or more messages and additional chat options.
 *
 * @author Mark Pollack
 * @since 1.0.0
 */
public class Prompt implements ModelRequest<List<Message>> {
```

**TypeScript (correct - no class-level JSDoc):**
```typescript
export class Prompt implements ModelRequest<Message[]> {
```

---

**Java (method-level Javadoc - do NOT migrate):**
```java
/**
 * Get the first system message in the prompt. If no system message is found, an empty
 * SystemMessage is returned.
 * @return a list of all system messages in the prompt
 */
public SystemMessage getSystemMessage() {
```

**TypeScript (correct - no method-level JSDoc):**
```typescript
get systemMessage(): SystemMessage {
```

---

**Java (field-level Javadoc - do NOT migrate):**
```java
/** The object mapper used for deserialization and other JSON operations. */
private final ObjectMapper objectMapper;
```

**TypeScript (correct - no field-level JSDoc):**
```typescript
private readonly _objectMapper: ObjectMapper;
```

---

**Java (license header - do NOT migrate):**
```java
/*
 * Copyright 2023-2024 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * ...
 */

package org.springframework.ai.retry;
```

**TypeScript (correct - no license header):**
```typescript
export class NonTransientAiException extends Error {
```

## Examples: What to Migrate

**Java (inline comments inside method body - DO migrate):**
```java
public T convert(String text) {
    // Clean the text before parsing
    String cleaned = textCleaner.clean(text);

    /* Fall back to raw text if JSON parsing fails */
    try {
        return objectMapper.readValue(cleaned, clazz);
    } catch (JsonProcessingException e) {
        // Return null for non-parseable responses
        return null;
    }
}
```

**TypeScript (correct - inline comments preserved):**
```typescript
convert(text: string): T | null {
    // Clean the text before parsing
    const cleaned = this._textCleaner.clean(text);

    /* Fall back to raw text if JSON parsing fails */
    try {
        return this._objectMapper.readValue(cleaned, this._clazz);
    } catch (e) {
        // Return null for non-parseable responses
        return null;
    }
}
```
