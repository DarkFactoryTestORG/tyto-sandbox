# Evidence standard

Evidence shows a reviewer that a change does what its issue asks. Each issue's **Evidence**
table lists items (E1, E2, …) with a capture type; this standard says how to produce each one.

## Where it goes

- Scripts live in `evidence/<issue number>/`, one file per evidence item: `E1.spec.ts` for a
  Playwright capture, `E2.sh` for an API call or query. Outputs (screenshots, GIFs, logs) are
  written under `evidence/<issue number>/out/`, which is not committed.
- A script runs against the **review seed** or the scenario the issue names, on the running stack
  (`pnpm --filter @plotline/api start`, `pnpm --filter @plotline/web start`).

## Acting as a user

Always use the dev auth bypass (`PLOTLINE_DEV_AUTH=1`): the header `x-plotline-dev-user: <email>`
for API calls, or the cookie of the same name in a browser. Resolve `{seed:<fixture>}` to ids with
`pnpm --filter @plotline/db fixtures --scenario <name>`; ids are derived from fixture names and
never change.

## Capture types

| Capture      | How                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| `test`       | Run the named tests on the base commit and on head; keep both JUnit files                                     |
| `api`        | `curl -sS -H "x-plotline-dev-user: <email>" …` through the API; save request and response                     |
| `query`      | `psql "$DATABASE_URL" -c "…"`; save the statement and its output                                              |
| `screenshot` | Playwright, at both standard viewports (375×812, 1440×900), full page unless the item says otherwise          |
| `gif`        | Playwright video of the steps, converted to GIF; keep it under 15 seconds                                     |
| `log`        | The command and its full output                                                                               |
| `benchmark`  | `autocannon` or a loop of timed requests: at least 200 requests after 20 warm-up requests; report p50 and p95 |
| `coverage`   | Vitest `--coverage` for the named files, base and head                                                        |

## Rules

- Evidence is reproducible: anyone can rerun the script and get the same result on the same seed.
- Never edit production code to make evidence easier to capture.
- Base vs head comparisons use the same seed, the same viewport and the same steps.
