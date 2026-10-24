# Coding standard

Plotline is a pnpm + Turborepo monorepo: `apps/api` (NestJS), `apps/web` (Next.js App Router),
`packages/{db,shared,ui-kit,textkit}`, and the Rust crate `crates/textkit`.

## TypeScript

- `strict` and `noUncheckedIndexedAccess` are on everywhere. Never use `any`; use `unknown` and
  narrow it. Avoid `as` casts unless you have just checked the shape.
- Types and request schemas shared by web and api live in `packages/shared` (zod). Change the
  schema there, and both sides follow. Don't redeclare a shape locally.
- Names say what things are: `dueDate`, not `d`; `membership`, not `m2`. Comments explain _why_.
- No dead code, no commented-out code, no `console.log` (ESLint fails on it).

## API (NestJS)

- One folder per area under `apps/api/src/<area>/`: a controller (HTTP only: params, guards,
  validation), a service (the logic and the queries), and a module. Small areas keep all three in
  `<area>.module.ts`.
- Validate every body and query with `new ZodPipe(schema)` and a schema from `@plotline/shared`.
  Invalid input is a **422** whose `errors` name each field (`ValidationErrorBody`).
- Auth: every route except `/health` and `/auth/login` is behind `AuthenticatedGuard`; the user is
  `@CurrentUser()`. Workspace routes (`:workspaceId`) use `RolesGuard` with `@Roles('<lowest role>')`.
- Errors are Nest exceptions: `NotFoundException` (404), `ForbiddenException` (403),
  `UnprocessableEntityException` (422), `ConflictException` (409). Someone outside a workspace
  gets **404**, never 403, so they can't learn that a resource exists.
- Database access goes through Drizzle (`@InjectDb() db: Database`). Writes that belong together
  run in `db.transaction`. Never build SQL by concatenating strings; use the `sql` template.
- Constructor-injected classes are value imports (`import { X }`, not `import type`): Nest reads
  them from emitted metadata.

## Database

- The schema is `packages/db/src/schema.ts`. Change it, then generate a migration with
  `pnpm --filter @plotline/db generate` and commit the SQL under `packages/db/migrations/`.
  Never edit a migration that is already on `dev`.
- Seeds are deterministic: fixed ids from `fixtureId('<name>')`, timestamps relative to the seed's
  `now`. New fixtures go in the scenario the issue names (`packages/db/seeds/`).

## Web (Next.js)

- Pages are client components under `apps/web/src/app/`; data comes from the API through
  `api()` / `useApi()` (`src/lib`), which call the same-origin `/api` proxy.
- UI comes from `@plotline/ui-kit` (Button, Modal, Toast, Spinner) and the app's own
  `src/components`. Styles are CSS modules next to the component. See the design standard.

## Rust

- `crates/textkit` is plain Rust; `packages/textkit` is its napi binding. `cargo clippy -D warnings`
  and `cargo fmt` must be clean. Public functions have doc comments and unit tests.
