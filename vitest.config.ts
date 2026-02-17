import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@nestjs-batch/commons": path.resolve(__dirname, "packages/commons/src"),
      "@nestjs-batch/core": path.resolve(__dirname, "packages/core/src"),
      "@nestjs-batch/infrastructure": path.resolve(
        __dirname,
        "packages/infrastructure/src",
      ),
      "@nestjs-batch/platform": path.resolve(
        __dirname,
        "packages/platform/src",
      ),
    },
  },
  test: {
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**"],
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
  },
});
