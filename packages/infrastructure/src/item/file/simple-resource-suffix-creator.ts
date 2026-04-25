import type { ResourceSuffixCreator } from "./resource-suffix-creator.interface.js";

export class SimpleResourceSuffixCreator implements ResourceSuffixCreator {
  getSuffix(index: number): string {
    return `.${index}`;
  }
}
