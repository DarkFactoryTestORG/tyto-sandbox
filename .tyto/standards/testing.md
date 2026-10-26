# Testing standard

Every runner writes JUnit XML to `reports/junit/` (one file per package). `pnpm turbo run test`
runs them all; the factory reads the reports by `classname` and `name`, so keep test names stable
and descriptive ("rejects an empty title with the field named", not "test 3").

| Level       | Runner                           | Where                                                   | Notes                                    |
| ----------- | -------------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| unit        | Vitest                           | next to the source: `src/**/*.test.ts(x)`               | Pure logic, no database                  |
| integration | Vitest + supertest               | `apps/api/test/**/*.test.ts`, `packages/db/test/**`     | Real Postgres at `DATABASE_URL`          |
| component   | Vitest + Testing Library (jsdom) | `apps/web/src/**/*.test.tsx`, `packages/ui-kit/test/**` | Query by role and accessible name        |
| e2e         | Playwright                       | `apps/web/e2e/**/*.spec.ts`                             | `pnpm test:e2e`, both standard viewports |
| Rust        | cargo nextest                    | inline `#[cfg(test)]` and `crates/*/tests/**`           | JUnit via the `ci` profile               |

## Integration tests against the database

- `DATABASE_URL` must point at a database you may wipe. Test files run one at a time.
- Start each file with `await resetAndSeed('<scenario>')` (`apps/api/test/helpers.ts`): it drops
  the schema, migrates and seeds. Use the scenario the issue names, usually `baseline`.
- Build the app with `createTestApp()` and call it with `as(app, '<email>')`, which uses the dev
  auth bypass. Refer to seeded rows by fixture name: `id('task.alpha-plan')`.
- Assert on status codes and response bodies, and on the database where the behaviour is a write.

## The dev auth bypass

With `PLOTLINE_DEV_AUTH=1` (never in production; the API refuses to start with it under
`NODE_ENV=production`), a request with header `x-plotline-dev-user: <email>`, or a cookie of the
same name, acts as the seeded user with that email. Integration tests, e2e tests and evidence
scripts use it instead of logging in. One test (`apps/api/test/auth.test.ts`) covers real login.

Seeded accounts: `owner@plotline.test` (Acme owner), `member@plotline.test` (Acme member),
`other-owner@plotline.test` (outside Acme). The `review` scenario adds more
(`packages/db/seeds/review/README.md`). Every seeded password is `plotline`.

## e2e

- In a factory issue pod the api (port 4000) and the web app (port 3000) already run in dev mode,
  started by the factory and listed in the prompt's environment. Use them: the Playwright config's
  `webServer` reuses a server already on its port (`reuseExistingServer`), so `pnpm test:e2e` and
  your own Playwright scripts run against the running stack. Never start a second copy or kill
  them; restart one with `tyto-code dev restart <app>` and read its log with `tyto-code dev logs <app>`.
- `pnpm test:e2e` resets and reseeds the database while the api runs. The api keeps working (its
  pool reconnects on the next query); if it misbehaves afterwards, `tyto-code dev restart api`.
- Log in with the `loginAs(email)` fixture (`apps/web/e2e/fixtures.ts`), which sets the bypass
  cookie. Locate elements by role and name, never by CSS class.
- Tests must not depend on each other: create the data a test changes inside the test.
- Both projects run: `desktop` (1440×900) and `phone` (375×812).

## External services

There are none yet. When one is added, its client takes its base URL from an env var (for
example `SLACK_API_BASE_URL`), and tests point it at a local fake started by the test.

## Rules

- A bug fix starts with a test that fails on the base commit and passes after the fix.
- Don't delete or weaken an existing test to make a change pass; if behaviour changes on purpose,
  update the test in the same commit and say why.
