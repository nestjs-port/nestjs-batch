import type { DynamicModule, InjectionToken, Provider } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { LoggerFactory } from "@nestjs-port/core";
import { NestLoggerFactory } from "../logging/index.js";
import type { NestBatchModuleOptions } from "./nest-batch-module.options.js";

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
