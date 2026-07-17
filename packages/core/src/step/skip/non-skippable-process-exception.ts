/* Copyright 2006-present the original author or authors. Licensed under the Apache License, Version 2.0. */

import { SkipException } from "./skip-exception.js";

/** Fatal exception thrown when a process operation cannot be skipped. */
export class NonSkippableProcessException extends SkipException {}
