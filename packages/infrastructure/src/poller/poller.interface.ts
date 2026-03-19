export interface Poller<T> {
  poll(callable: () => T | null): Promise<T>;
}
