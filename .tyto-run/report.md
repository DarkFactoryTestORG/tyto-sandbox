## Summary

Smoke run 202610262037: happy path.

Refs #101. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #101`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 4b9b0253b987, a2c3b52fc26a |

## Decisions

None.

## Preview

http://101-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/544b4867b734e267c06e08948c938ff30d44ef0e/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 5 seconds (measured when this head started).

It serves `544b4867b734`.

## Ledger

No feedback.

## Dismissals

None

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log | Lint gate output for the delivered code | [aad0d7148034](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/101/aad0d7148034dbd9120612bc96b5ad35d6a77490/E1/smoke-lint.txt) |

### Screenshots

None captured.

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:544b4867b734e267c06e08948c938ff30d44ef0e` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:544b4867b734e267c06e08948c938ff30d44ef0e` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

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

- Issue: DarkFactoryTestORG/tyto-sandbox#101, mode `smoke`, attempt 2
- Branch: `tyto/101-smoke-happy-path-202610262037` from `374e7072ff30` (`dev` was `374e7072ff30` when it was prepared)
- Cost: $0.03

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/101-smoke-happy-path-202610262037 (fetched (cfbdbdee8ec5)), base 374e7072ff30, run state restored from 867e7aa64924 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 606dfb0efc97 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added one Unreleased entry for smoke run 202610262037: happy path (#101). |
| flow/smoke-check | smoke-check | done | Verified the one-line changelog entry matches the Summary; no correction needed, and formatting passes. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync@2 | sync | done | merging dev at 374e7072ff30 conflicts in 1 path(s): CHANGELOG.md |
| flow/ledger@2 | ledger | done | No feedback. 0 open (0 required) |
| flow/judge@2 | judge | done | round 2: no open items; the merge with dev resolved  Resolved the changelog merge conflict preserving both entries; lint, typecheck, and all tests pass. |
| flow/ledger@3 | ledger | done | No feedback. 0 open (0 required) |
| flow/judge@3 | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates@2 | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images@2 | review-images | done | 2 review image(s) built for 544b4867b734 |
| flow/review-seed@2 | review-seed | done | database seeded with the review scenario review |
| flow/preview@2 | preview | done | preview at http://101-tyto-sandbox.localtest.me:8080/ for 544b4867b734 (started in 4.7 s) |
| flow/smoke-evidence@2 | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/101/aad0d7148034dbd9120612bc96b5ad35d6a77490/E1/smoke-lint.txt |

</details>
