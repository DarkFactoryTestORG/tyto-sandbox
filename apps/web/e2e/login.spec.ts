import { expect, OWNER, test } from './fixtures';

test('a seeded user logs in with their password and lands in their workspace', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel('Email').fill(OWNER);
  await page.getByLabel('Password').fill('plotline');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/w\/acme$/);
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
});

test('a wrong password shows an error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(OWNER);
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Wrong email or password' })).toBeVisible();
});
