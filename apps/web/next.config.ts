import { join } from 'node:path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  // The review image runs .next/standalone/apps/web/server.js (apps/web/Dockerfile).
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../..'),
  transpilePackages: ['@plotline/ui-kit', '@plotline/shared'],
  // Lint and typecheck are their own turbo tasks.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  poweredByHeader: false,
};

export default config;
