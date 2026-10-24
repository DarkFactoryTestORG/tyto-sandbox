# Plotline

A small team task tracker: workspaces with members (owner, admin, member, viewer), projects and
tasks with assignees, due dates, labels and comments, invites, activity, and seat billing.

Plotline is the **sandbox app of the TYTO software factory**. The factory builds against it, and the
worked examples in the factory's issue catalogue are written for it. It is an ordinary project:
people and agent sessions change it through pull requests into `dev`, and the factory reads its
contract from [`.tyto/config.yaml`](.tyto/config.yaml).

| Part                                  | Stack                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `apps/web`                            | Next.js 15 (App Router), React 19, CSS modules, `@plotline/ui-kit`                                |
| `apps/api`                            | NestJS 11, Passport (local strategy, session cookies in Postgres), Drizzle                        |
| `packages/db`                         | Drizzle schema, SQL migrations, seed scenarios, migrate/reset/seed CLIs                           |
| `packages/shared`                     | zod schemas and types shared by web and api                                                       |
| `packages/ui-kit`                     | The design library (Button, Modal, Toast, theme tokens), v3.8.2                                   |
| `crates/textkit` + `packages/textkit` | A Rust crate (slugs, search keys) and its napi-rs binding, used by the api                        |
| tooling                               | pnpm 10, Turborepo (strict env mode), Vitest, Playwright, ESLint, Prettier, clippy, cargo-nextest |

## Run it locally

You need Node 22.22, pnpm 10 (`corepack enable`), Rust 1.97 (`rust-toolchain.toml` pins it;
rustup installs it), [cargo-nextest](https://nexte.st) for the Rust tests, and Postgres 17
(16 works too).

```bash
cp .env.example .env && set -a && . ./.env && set +a
pnpm install
pnpm build                                  # builds the Rust addon too
pnpm db:reset && pnpm db:seed --scenario baseline
pnpm --filter @plotline/api start           # http://localhost:4000 (PORT)
pnpm --filter @plotline/web start           # http://localhost:3000, proxies /api to API_URL
```

Log in as `owner@plotline.test` with password `plotline`.

| Command                                                 | What it does                                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm test`                                             | Unit, integration (needs `DATABASE_URL`) and Rust tests; JUnit XML in `reports/junit/` |
| `pnpm test:e2e`                                         | Resets and seeds `baseline`, then Playwright at 1440×900 and 375×812                   |
| `pnpm lint` / `pnpm typecheck` / `pnpm format:check`    | ESLint + clippy / tsc + cargo check / Prettier + rustfmt                               |
| `pnpm db:migrate` / `pnpm db:reset`                     | Apply migrations / drop everything and migrate from scratch                            |
| `pnpm db:seed --scenario <name>`                        | Seed `baseline`, `large-project` or `review` (`--now <ISO time>` moves the dates)      |
| `pnpm --filter @plotline/db fixtures --scenario <name>` | Print fixture name → id (ids are derived from names)                                   |
| `pnpm --filter @plotline/db generate`                   | Generate a migration after changing `packages/db/src/schema.ts`                        |
| `scripts/factory-check.sh`                              | Prove the repo meets the factory contract (Docker; `--local` without)                  |

## Seeds

Seeds are deterministic: ids come from fixture names (`fixtureId('user.owner')`), and timestamps
are relative to a fixed "now" (2026-10-01T09:00:00Z unless `--now` or `PLOTLINE_SEED_NOW`).

- `baseline`: the fixtures the issue catalogue names (`workspace.acme`, `user.owner`,
  `user.member`, `project.alpha`, `workspace.other`) and a few tasks.
- `large-project`: baseline plus `project.large` (50,000 tasks) and `project.small` (20).
- `review`: what every preview shows reviewers. Accounts are listed in
  [`packages/db/seeds/review/README.md`](packages/db/seeds/review/README.md).

## The dev auth bypass

With `PLOTLINE_DEV_AUTH=1`, a request with the header `x-plotline-dev-user: <email>`, or a cookie of
the same name, acts as that seeded user. Tests, agents and evidence capture use it. The API logs a
loud warning whenever it is on, and **refuses to start** with it under `NODE_ENV=production`.
Previews run with `NODE_ENV=preview`, so they keep it.

## Review images

`apps/api/Dockerfile` and `apps/web/Dockerfile` build from the repo root. Both run as non-root,
need only env vars and a database, and write nothing outside `/tmp`. The API runs migrations on
start with `PLOTLINE_MIGRATE_ON_START=1`.

## Planted bugs

Some bugs are planted on purpose, so the factory has real bugs to find. They are listed in
[`docs/planted-bugs.md`](docs/planted-bugs.md); **don't fix them** by hand.
[`docs/catalogue-state.md`](docs/catalogue-state.md) maps every catalogue example to the code it
starts from.

## Contributing

PRs target `dev`. CI runs lint, typecheck, format, clippy, every test level and e2e, and the
`changelog-format` check: add a line under **Unreleased** in [`CHANGELOG.md`](CHANGELOG.md) ending
with the issue it closes, `(#n)`.
