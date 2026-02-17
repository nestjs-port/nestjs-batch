/**
 * Value object used to carry information about the status of a job or step execution.
 *
 * ExitStatus is immutable and, therefore, thread-safe.
 */
export class ExitStatus {
  /**
   * Convenient constant value representing unknown state - assumed to not be continuable.
   */
  static readonly UNKNOWN = new ExitStatus("UNKNOWN");

  /**
   * Convenient constant value representing continuable state where processing is still
   * taking place, so no further action is required.
   */
  static readonly EXECUTING = new ExitStatus("EXECUTING");

  /**
   * Convenient constant value representing finished processing.
   */
  static readonly COMPLETED = new ExitStatus("COMPLETED");

  /**
   * Convenient constant value representing a job that did no processing.
   */
  static readonly NOOP = new ExitStatus("NOOP");

  /**
   * Convenient constant value representing finished processing with an error.
   */
  static readonly FAILED = new ExitStatus("FAILED");

  /**
   * Convenient constant value representing finished processing with interrupted status.
   */
  static readonly STOPPED = new ExitStatus("STOPPED");

  private readonly _exitCode: string;
  private readonly _exitDescription: string;

  /**
   * Creates an ExitStatus with the given exit code and optional description.
   * @param exitCode - the exit code
   * @param exitDescription - the exit description (defaults to empty string)
   */
  constructor(exitCode: string, exitDescription = "") {
    this._exitCode = exitCode;
    this._exitDescription = exitDescription ?? "";
  }

  /**
   * Getter for the exit code (defaults to blank).
   * @return the exit code.
   */
  get exitCode(): string {
    return this._exitCode;
  }

  /**
   * Getter for the exit description (defaults to blank)
   * @return {@link String} containing the exit description.
   */
  get exitDescription(): string {
    return this._exitDescription;
  }

  /**
   * Create a new {@link ExitStatus} with a logical combination of the exit code and a
   * concatenation of the descriptions. If either value has a higher severity, its exit
   * code is used in the result. In the case of equal severity, the exit code is
   * replaced if the new value is alphabetically greater.<br>
   * <br>
   *
   * Severity is defined by the exit code:
   * <ul>
   * <li>Codes beginning with EXECUTING have severity 1</li>
   * <li>Codes beginning with COMPLETED have severity 2</li>
   * <li>Codes beginning with NOOP have severity 3</li>
   * <li>Codes beginning with STOPPED have severity 4</li>
   * <li>Codes beginning with FAILED have severity 5</li>
   * <li>Codes beginning with UNKNOWN have severity 6</li>
   * </ul>
   * Others have severity 7, so custom exit codes always win.<br>
   *
   * If the input is {@code null} just return this.
   * @param status An {@link ExitStatus} object to combine with this one.
   * @return a new {@link ExitStatus} combining the current value and the argument
   * provided.
   */
  and(status: ExitStatus | null): ExitStatus {
    if (status === null) {
      return this;
    }
    let result = this.addExitDescription(status._exitDescription);
    if (this.compareTo(status) < 0) {
      result = result.replaceExitCode(status._exitCode);
    }
    return result;
  }

  /**
   * Compares this ExitStatus with another based on severity and exit code.
   * @param status - an ExitStatus to compare
   * @returns greater than zero, 0, or less than zero
   */
  compareTo(status: ExitStatus): number {
    const thisSeverity = this.severity(this);
    const otherSeverity = this.severity(status);

    if (otherSeverity > thisSeverity) {
      return -1;
    }
    if (otherSeverity < thisSeverity) {
      return 1;
    }
    return this._exitCode.localeCompare(status._exitCode);
  }

  /**
   * Determines severity based on an ExitStatus object.
   * @param status - the ExitStatus to evaluate
   * @returns the severity number (1-7)
   */
  private severity(status: ExitStatus): number {
    if (status._exitCode.startsWith(ExitStatus.EXECUTING._exitCode)) {
      return 1;
    }
    if (status._exitCode.startsWith(ExitStatus.COMPLETED._exitCode)) {
      return 2;
    }
    if (status._exitCode.startsWith(ExitStatus.NOOP._exitCode)) {
      return 3;
    }
    if (status._exitCode.startsWith(ExitStatus.STOPPED._exitCode)) {
      return 4;
    }
    if (status._exitCode.startsWith(ExitStatus.FAILED._exitCode)) {
      return 5;
    }
    if (status._exitCode.startsWith(ExitStatus.UNKNOWN._exitCode)) {
      return 6;
    }
    return 7;
  }

  /**
   * Add an exit code to an existing ExitStatus.
   * @param code - the code to add
   * @returns a new ExitStatus with the new exit code
   */
  replaceExitCode(code: string): ExitStatus {
    return new ExitStatus(code, this._exitDescription);
  }

  /**
   * Check if this status represents a running process.
   * @returns true if the exit code is EXECUTING or UNKNOWN
   */
  isRunning(): boolean {
    return (
      this._exitCode === ExitStatus.EXECUTING._exitCode ||
      this._exitCode === ExitStatus.UNKNOWN._exitCode
    );
  }

  /**
   * Add an exit description to an existing {@link ExitStatus}. If there is already a
   * description present, the two are concatenated with a semicolon.
   * @param description The description to add.
   * @return a new {@link ExitStatus} with the same properties but a new exit
   * description.
   */
  addExitDescription(description: string): ExitStatus {
    if (this._exitDescription) {
      if (description && this._exitDescription !== description) {
        return new ExitStatus(
          this._exitCode,
          `${this._exitDescription}; ${description}`,
        );
      }
      return this;
    }
    return new ExitStatus(this._exitCode, description);
  }

  /**
   * Extract the stack trace from an error and append it to the description.
   * @param error - an Error instance
   * @returns a new ExitStatus with the stack trace appended
   */
  addExitDescriptionFromError(error: Error): ExitStatus {
    const message = error.stack ?? error.message;
    return this.addExitDescription(message);
  }

  /**
   * Checks if the status is a non-default exit status.
   * @param status - the ExitStatus to evaluate
   * @returns true if the value matches a known exit code
   */
  static isNonDefaultExitStatus(status: ExitStatus | null): boolean {
    return (
      status === null ||
      status._exitCode == null ||
      status._exitCode === ExitStatus.COMPLETED._exitCode ||
      status._exitCode === ExitStatus.EXECUTING._exitCode ||
      status._exitCode === ExitStatus.FAILED._exitCode ||
      status._exitCode === ExitStatus.NOOP._exitCode ||
      status._exitCode === ExitStatus.STOPPED._exitCode ||
      status._exitCode === ExitStatus.UNKNOWN._exitCode
    );
  }
}
