import { test as base, expect } from '@playwright/test';
import { DEV_AUTH_COOKIE } from '@plotline/shared';

/** A page logged in as a seeded user through the dev auth bypass cookie (PLOTLINE_DEV_AUTH=1). */
export const test = base.extend<{ loginAs: (email: string) => Promise<void> }>({
  loginAs: async ({ context, baseURL }, use) => {
    await use(async (email) => {
      await context.addCookies([{ name: DEV_AUTH_COOKIE, value: encodeURIComponent(email), url: baseURL! }]);
    });
  },
});

export { expect };
export const OWNER = 'owner@plotline.test';
export const MEMBER = 'member@plotline.test';
export const OUTSIDER = 'other-owner@plotline.test';
