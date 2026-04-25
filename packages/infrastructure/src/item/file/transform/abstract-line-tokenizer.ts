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

import { StringUtils } from "@nestjs-port/core";

import { DefaultFieldSetFactory } from "./default-field-set-factory.js";
import type { FieldSet } from "./field-set.interface.js";
import type { FieldSetFactory } from "./field-set-factory.interface.js";
import { IncorrectTokenCountException } from "./incorrect-token-count-exception.js";
import type { LineTokenizer } from "./line-tokenizer.js";

export abstract class AbstractLineTokenizer implements LineTokenizer {
  private static readonly EMPTY_TOKEN = "";

  protected _names: string[] = [];

  private _strict = true;

  private _fieldSetFactory: FieldSetFactory = new DefaultFieldSetFactory();

  setStrict(strict: boolean): void {
    this._strict = strict;
  }

  protected isStrict(): boolean {
    return this._strict;
  }

  setFieldSetFactory(fieldSetFactory: FieldSetFactory): void {
    this._fieldSetFactory = fieldSetFactory;
  }

  setNames(...names: string[]): void {
    let valid = false;
    for (const name of names) {
      if (StringUtils.hasText(name)) {
        valid = true;
        break;
      }
    }

    if (valid) {
      this._names = [...names];
    }
  }

  hasNames(): boolean {
    return this._names.length > 0;
  }

  tokenize(line: string): FieldSet {
    let sourceLine = line;
    if (sourceLine == null) {
      sourceLine = "";
    }

    const tokens = [...this.doTokenize(sourceLine)];

    if (this._names.length !== 0 && !this._strict) {
      this.adjustTokenCountIfNecessary(tokens);
    }

    const values = [...tokens];

    if (this._names.length === 0) {
      return this._fieldSetFactory.create(values);
    }
    if (values.length !== this._names.length) {
      throw new IncorrectTokenCountException(
        this._names.length,
        values.length,
        sourceLine,
      );
    }
    return this._fieldSetFactory.create(values, this._names);
  }

  protected abstract doTokenize(line: string): string[];

  private adjustTokenCountIfNecessary(tokens: string[]): void {
    const nameLength = this._names.length;
    const tokensSize = tokens.length;

    if (nameLength !== tokensSize) {
      if (nameLength > tokensSize) {
        for (let i = 0; i < nameLength - tokensSize; i += 1) {
          tokens.push(AbstractLineTokenizer.EMPTY_TOKEN);
        }
      } else {
        tokens.splice(nameLength, tokensSize - nameLength);
      }
    }
  }
}
