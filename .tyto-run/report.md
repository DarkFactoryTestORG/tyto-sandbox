## Summary

Smoke run 202610261929: happy path.

Refs #89. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #89`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 770a32047d63, 32a18f8dd94b |

## Decisions

None.

## Preview

http://89-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/20018014f8877b32624a85e0d51bfaefebf38936/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 4 seconds (measured when this head started).

It serves `20018014f887`.

## Ledger

No feedback.

## Dismissals

None

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log | Lint gate output for the delivered code | [ff4d9e99fd87](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/89/ff4d9e99fd879d8e55d7dac9fbf411ce02beacc1/E1/smoke-lint.txt) |

### Screenshots

None captured.

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:20018014f8877b32624a85e0d51bfaefebf38936` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:20018014f8877b32624a85e0d51bfaefebf38936` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Scope

In: one new line in CHANGELOG.md under Unreleased
Out: any other file, including the README; changes to existing changelog entries

## Evidence requested

- E1 (`log`): Capture the lint gate output with the new entry
- E2 (`ui`): Screenshot /login from the running web app with Playwright

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#89, mode `smoke`, attempt 2
- Branch: `tyto/89-smoke-happy-path-202610261929` from `cf78b51ccbc8` (`dev` was `cf78b51ccbc8` when it was prepared)
- Cost: $0.07

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/89-smoke-happy-path-202610261929 (fetched (c6ab3e5b53e1)), base cf78b51ccbc8, run state restored from 944502077a85 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 2ea4119c61b8 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added one Unreleased changelog entry for smoke run 202610261929: happy path (#89). |
| flow/smoke-check | smoke-check | done | Verified the one-line entry matches the Summary; no correction needed, and format checks pass. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync@2 | sync | done | merging dev at cf78b51ccbc8 conflicts in 1 path(s): CHANGELOG.md |
| flow/ledger@2 | ledger | done | No feedback. 0 open (0 required) |
| flow/judge@2 | judge | done | round 2: no open items; the merge with dev resolved  Resolved the changelog conflict preserving both entries; lint, typecheck, tests and changelog formatting pass. |
| flow/ledger@3 | ledger | done | No feedback. 0 open (0 required) |
| flow/judge@3 | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates@2 | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images@2 | review-images | done | 2 review image(s) built for 20018014f887 |
| flow/review-seed@2 | review-seed | done | database seeded with the review scenario review |
| flow/preview@2 | preview | done | preview at http://89-tyto-sandbox.localtest.me:8080/ for 20018014f887 (started in 4.4 s) |
| flow/smoke-evidence@2 | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/89/ff4d9e99fd879d8e55d7dac9fbf411ce02beacc1/E1/smoke-lint.txt |

</details>
