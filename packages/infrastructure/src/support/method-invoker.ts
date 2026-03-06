export interface MethodInvoker {
  invokeMethod(...args: Array<unknown | null>): unknown | null;
}
