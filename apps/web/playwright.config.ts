import { defineConfig, devices } from '@playwright/test';

// e2e runs against `start` of both apps (built first by turbo's test:e2e dependencies) on a
// database seeded with `baseline` (the root `pnpm test:e2e` resets and seeds it).
// In a factory issue pod both apps already run in dev mode on these ports (phase 18's dev-servers):
// reuseExistingServer makes Playwright use them instead of starting a second copy. CI is unset in the pod.
const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000';
const API_PORT = 4000;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['junit', { outputFile: '../../reports/junit/e2e.xml' }]],
  use: { baseURL: WEB_URL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'phone',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
  webServer: process.env.WEB_URL
    ? undefined
    : [
        {
          command: 'pnpm --filter @plotline/api start',
          url: `http://localhost:${API_PORT}/health`,
          env: { PORT: String(API_PORT), PLOTLINE_DEV_AUTH: '1', NODE_ENV: 'development' },
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
        {
          command: 'pnpm --filter @plotline/web start',
          url: WEB_URL,
          env: { PORT: '3000', API_URL: `http://localhost:${API_PORT}` },
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      ],
});
