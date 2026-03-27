import type { DynamicModule, InjectionToken, Provider } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { LoggerFactory } from "@nestjs-batch/commons";
import { NestLoggerFactory } from "../logging";
import type { NestBatchModuleOptions } from "./nest-batch-module.options";

@Module({})
export class NestBatchModule {
  static forRoot(options: NestBatchModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [];
    const exports: InjectionToken[] = [];

    LoggerFactory.bind(new NestLoggerFactory());

    return {
      module: NestBatchModule,
      providers,
      exports,
      global: options.global ?? true,
    };
  }
}
