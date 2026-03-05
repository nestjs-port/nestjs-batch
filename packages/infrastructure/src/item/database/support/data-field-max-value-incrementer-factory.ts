import type { DataFieldMaxValueIncrementer } from "@nestjs-batch/commons";

export interface DataFieldMaxValueIncrementerFactory {
  getIncrementer(
    databaseType: string,
    incrementerName: string,
  ): DataFieldMaxValueIncrementer;

  isSupportedIncrementerType(databaseType: string): boolean;

  get supportedIncrementerTypes(): string[];
}
