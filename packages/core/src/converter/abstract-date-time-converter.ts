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

interface DateTimeFormatter {
  format(value: Date): string;
}

/** Base class for date/time converters. */
export abstract class AbstractDateTimeConverter {
  protected readonly instantFormatter: DateTimeFormatter = {
    format: (value) => value.toISOString(),
  };

  protected readonly localDateFormatter: DateTimeFormatter = {
    format: (value) => value.toISOString().slice(0, 10),
  };

  protected readonly localTimeFormatter: DateTimeFormatter = {
    format: (value) => value.toISOString().slice(11, 23),
  };

  protected readonly localDateTimeFormatter: DateTimeFormatter = {
    format: (value) => value.toISOString().slice(0, 23),
  };
}
