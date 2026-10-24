import { defineConfig } from 'drizzle-kit';

// `pnpm --filter @plotline/db generate` writes a new SQL migration from the schema. Commit it.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './migrations',
});
