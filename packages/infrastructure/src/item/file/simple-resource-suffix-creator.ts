import type { ResourceSuffixCreator } from "./resource-suffix-creator.interface";

export class SimpleResourceSuffixCreator implements ResourceSuffixCreator {
  getSuffix(index: number): string {
    return `.${index}`;
  }
}
