import { StringUtils } from "@nestjs-batch/commons";

import { DefaultFieldSetFactory } from "./default-field-set-factory";
import type { FieldSet } from "./field-set.interface";
import type { FieldSetFactory } from "./field-set-factory.interface";
import { IncorrectTokenCountException } from "./incorrect-token-count-exception";
import type { LineTokenizer } from "./line-tokenizer";

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
