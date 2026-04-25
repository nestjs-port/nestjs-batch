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

import type { MailMessage } from "@nestjs-batch/commons";

import type { MailErrorHandler } from "./mail-error-handler.interface.js";

export class DefaultMailErrorHandler implements MailErrorHandler {
  static readonly DEFAULT_MAX_MESSAGE_LENGTH = 1024;

  private _maxMessageLength =
    DefaultMailErrorHandler.DEFAULT_MAX_MESSAGE_LENGTH;

  setMaxMessageLength(maxMessageLength: number): void {
    this._maxMessageLength = maxMessageLength;
  }

  handle(message: MailMessage, exception: Error): void {
    const msg = message.toString();
    throw new Error(
      `Mail server send failed: ${msg.slice(0, this._maxMessageLength)}`,
      { cause: exception },
    );
  }
}
