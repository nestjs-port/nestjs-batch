import assert from "node:assert/strict";

import { StringUtils } from "@nestjs-port/core";

import { DynamicMethodInvocationException } from "./dynamic-method-invocation-exception";

type InvocableMethod = (...args: Array<unknown | null>) => unknown;

export abstract class AbstractMethodInvokingDelegator<T> {
  private _targetObject: object | null = null;

  private _targetMethod: string | null = null;

  private _arguments: Array<unknown | null> | null = null;

  protected async invokeDelegateMethod(): Promise<T | null> {
    const invoker = this.createMethodInvoker(
      this._targetObject,
      this._targetMethod,
    );
    return this.doInvoke(invoker, this._arguments);
  }

  protected async invokeDelegateMethodWithArgument(
    object: unknown | null,
  ): Promise<T | null> {
    const invoker = this.createMethodInvoker(
      this._targetObject,
      this._targetMethod,
    );
    return this.doInvoke(invoker, [object]);
  }

  protected async invokeDelegateMethodWithArguments(
    args: Array<unknown | null> | null,
  ): Promise<T | null> {
    const invoker = this.createMethodInvoker(
      this._targetObject,
      this._targetMethod,
    );
    return this.doInvoke(invoker, args);
  }

  private createMethodInvoker(
    targetObject: object | null,
    targetMethod: string | null,
  ): InvocableMethod {
    if (targetObject == null || !StringUtils.hasText(targetMethod)) {
      throw new DynamicMethodInvocationException(
        "Target object and target method must be configured",
        null,
      );
    }

    return (...args: Array<unknown | null>): unknown => {
      const method = this.resolveMethod(targetObject, targetMethod, args);
      if (method == null) {
        throw new DynamicMethodInvocationException(
          `No matching method found: ${targetMethod}`,
          null,
        );
      }
      return method.apply(targetObject, args);
    };
  }

  private async doInvoke(
    invoker: InvocableMethod,
    args: Array<unknown | null> | null,
  ): Promise<T | null> {
    try {
      return (await Promise.resolve(invoker(...(args ?? [])))) as T | null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InvocationTargetThrowableWrapper(error);
    }
  }

  afterPropertiesSet(): void {
    assert.ok(this._targetObject != null, "targetObject must not be null");
    assert.ok(
      StringUtils.hasText(this._targetMethod),
      "targetMethod must not be empty",
    );
    assert.ok(
      this.targetClassDeclaresTargetMethod(),
      "target class must declare a method with matching name and parameter types",
    );
  }

  private targetClassDeclaresTargetMethod(): boolean {
    if (
      this._targetObject == null ||
      !StringUtils.hasText(this._targetMethod)
    ) {
      return false;
    }

    const methods = this.collectMethods(this._targetObject, this._targetMethod);

    for (const method of methods) {
      if (this._arguments == null) {
        // don't check signature, assume arguments will be supplied
        // correctly at runtime
        return true;
      }
      if (method.length === this._arguments.length) {
        let argumentsMatchParameters = true;
        for (let j = 0; j < method.length; j++) {
          const argument = this._arguments[j];
          if (argument == null) {
            continue;
          }
          if (!this.isAssignableValue(method, j, argument)) {
            argumentsMatchParameters = false;
          }
        }
        if (argumentsMatchParameters) {
          return true;
        }
      }
    }

    return false;
  }

  private isAssignableValue(
    _method: InvocableMethod,
    _paramIndex: number,
    value: unknown,
  ): boolean {
    // JS has no compile-time parameter type info.
    // Basic runtime check: verify the value is not undefined.
    // This mirrors ClassUtils.isAssignableValue semantics where
    // any non-null object is generally assignable.
    return value !== undefined;
  }

  public setTargetObject(targetObject: object): void {
    this._targetObject = targetObject;
  }

  public setTargetMethod(targetMethod: string): void {
    this._targetMethod = targetMethod;
  }

  public setArguments(arguments_: Array<unknown | null> | null): void {
    this._arguments = arguments_ == null ? null : [...arguments_];
  }

  protected getArguments(): Array<unknown | null> | null {
    return this._arguments;
  }

  protected getTargetObject(): object | null {
    return this._targetObject;
  }

  protected getTargetMethod(): string | null {
    return this._targetMethod;
  }

  private resolveMethod(
    targetObject: object,
    targetMethod: string,
    args: Array<unknown | null>,
  ): InvocableMethod | null {
    const methods = this.collectMethods(targetObject, targetMethod);
    if (methods.length === 0) {
      return null;
    }
    for (const method of methods) {
      if (method.length === args.length) {
        return method;
      }
    }
    // fallback: if no exact match, use first available method
    return methods[0] ?? null;
  }

  /**
   * Collects methods matching the given name from the target object and its
   * prototype chain. Mirrors Java's combination of
   * {@code Class.getMethods()} + {@code Class.getDeclaredMethods()}.
   */
  private collectMethods(
    targetObject: object,
    targetMethod: string,
  ): InvocableMethod[] {
    const methods: InvocableMethod[] = [];
    const seen = new Set<InvocableMethod>();

    // Check own properties of the instance (e.g. arrow function fields)
    const ownDescriptor = Object.getOwnPropertyDescriptor(
      targetObject,
      targetMethod,
    );
    if (typeof ownDescriptor?.value === "function") {
      const method = ownDescriptor.value as InvocableMethod;
      methods.push(method);
      seen.add(method);
    }

    // Traverse prototype chain (analogous to getMethods + getDeclaredMethods)
    let prototype = Object.getPrototypeOf(targetObject) as object | null;
    while (prototype != null && prototype !== Object.prototype) {
      const descriptor = Object.getOwnPropertyDescriptor(
        prototype,
        targetMethod,
      );
      if (typeof descriptor?.value === "function") {
        const method = descriptor.value as InvocableMethod;
        if (!seen.has(method)) {
          methods.push(method);
          seen.add(method);
        }
      }
      prototype = Object.getPrototypeOf(prototype) as object | null;
    }

    return methods;
  }
}

export class InvocationTargetThrowableWrapper extends Error {
  constructor(cause: unknown | null) {
    const message = cause instanceof Error ? cause.message : String(cause);
    super(message, cause == null ? undefined : { cause });
  }
}
