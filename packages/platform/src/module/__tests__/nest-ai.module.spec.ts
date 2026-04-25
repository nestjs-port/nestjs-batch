import { describe, expect, it } from "vitest";
import { NestBatchModule } from "../nest-batch.module.js";

describe("NestAIModule", () => {
  it("registers default HTTP client provider in forRoot", () => {
    const dynamicModule = NestBatchModule.forRoot();

    expect(dynamicModule.module).toBe(NestBatchModule);
    expect(dynamicModule.global).toBe(true);
  });
});
