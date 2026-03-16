import { Writer } from "@nestjs-batch/commons";

export interface FlatFileFooterCallback {
  writeFooter(writer: Writer): void;
}
