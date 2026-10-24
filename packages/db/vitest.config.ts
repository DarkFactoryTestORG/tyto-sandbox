import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // One database for the package: files run one at a time.
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 120_000,
    reporters: ['default', ['junit', { outputFile: '../../reports/junit/db.xml' }]],
  },
});
