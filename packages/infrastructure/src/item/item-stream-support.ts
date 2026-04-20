import { ExecutionContextUserSupport } from "./util";

export abstract class ItemStreamSupport {
  private readonly _defaultName: string;

  private readonly _executionContextUserSupport =
    new ExecutionContextUserSupport();

  private _name: string;

  protected constructor() {
    this._defaultName = new.target.name;
    this._name = this._defaultName;
    this._executionContextUserSupport.setName(this._defaultName);
  }

  setName(name: string): void {
    this.setExecutionContextName(name);
  }

  setBeanName(name: string): void {
    if (this._name === this._defaultName) {
      this.setName(name);
    }
  }

  get name(): string {
    return this._executionContextUserSupport.getName() ?? this._name;
  }

  protected setExecutionContextName(name: string): void {
    this._name = name;
    this._executionContextUserSupport.setName(name);
  }

  getExecutionContextKey(key: string): string {
    return this._executionContextUserSupport.getKey(key);
  }
}
