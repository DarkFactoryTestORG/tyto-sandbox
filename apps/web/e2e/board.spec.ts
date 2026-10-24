import { expect, MEMBER, OUTSIDER, OWNER, test } from './fixtures';

test('the project board lists tasks and opens one in the drawer', async ({ page, loginAs }) => {
  await loginAs(OWNER);
  await page.goto('/w/acme');
  await page.getByRole('link', { name: 'Alpha' }).click();
  await expect(page.getByRole('heading', { name: 'Alpha', level: 1 })).toBeVisible();
  for (const title of ['Write the launch plan', 'Fix the login redirect loop', 'Kickoff meeting notes']) {
    await expect(page.getByRole('button', { name: title })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Write the launch plan' }).click();
  const drawer = page.getByRole('dialog', { name: 'Write the launch plan' });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText('Olivia Owner')).toBeVisible();
});

test('a member adds a task and completes it', async ({ page, loginAs }) => {
  await loginAs(MEMBER);
  const title = `E2E task ${Date.now()}`;
  await page.goto('/w/acme/p/alpha');
  await page.getByPlaceholder('Add a task').fill(title);
  await page.getByRole('button', { name: 'Add task' }).click();
  await page.getByRole('button', { name: title }).click();
  await page.getByRole('button', { name: 'Complete' }).click();
  await expect(page.getByRole('dialog', { name: title }).getByText('Done')).toBeVisible();
});

test('a member edits a task title in the edit modal', async ({ page, loginAs }) => {
  await loginAs(MEMBER);
  const title = `Rename me ${Date.now()}`;
  await page.goto('/w/acme/p/alpha');
  await page.getByPlaceholder('Add a task').fill(title);
  await page.getByRole('button', { name: 'Add task' }).click();
  await page.getByRole('button', { name: title }).click();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  const modal = page.getByRole('dialog', { name: 'Edit task' });
  await modal.getByLabel('Title').fill(`${title} (edited)`);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('dialog', { name: `${title} (edited)` })).toBeVisible();
});

test('someone outside the workspace gets not-found', async ({ page, loginAs }) => {
  await loginAs(OUTSIDER);
  await page.goto('/w/acme');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
