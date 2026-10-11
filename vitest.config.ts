/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src/lib/**/*.ts"],
      thresholds: { lines: 90, statements: 90 },
    },
    include: ["tests/unit/**/*.test.ts"],
  },
});
