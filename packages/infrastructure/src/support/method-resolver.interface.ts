export interface MethodResolver {
  findMethod(candidate: unknown): string | null;
}
