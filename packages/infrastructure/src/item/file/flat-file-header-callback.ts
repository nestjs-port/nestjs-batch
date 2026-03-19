import type { Writer } from "@nestjs-batch/commons";

export interface FlatFileHeaderCallback {
  writeHeader(writer: Writer): void;
}
