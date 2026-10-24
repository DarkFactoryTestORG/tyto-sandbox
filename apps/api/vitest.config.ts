import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC compiles the decorators and emits the type metadata Nest's injector reads (esbuild cannot).
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    // Integration tests share one database (DATABASE_URL) and reset it per file.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
    reporters: ['default', ['junit', { outputFile: '../../reports/junit/api.xml' }]],
  },
});
