## Summary

Smoke run 202610261513: recovery.

Refs #79. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #79`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | d5fc15f14d15, 15442a565c26 |

## Decisions

None.

## Preview

http://79-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/074fef7d37eabe93ac430c2898fe0bdbfe669b31/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 4 seconds (measured when this head started).

It serves `074fef7d37ea`.

## Ledger

No feedback.

## Dismissals

None

## Evidence

### Logs

None captured.

### Screenshots

None captured.

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:074fef7d37eabe93ac430c2898fe0bdbfe669b31` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:074fef7d37eabe93ac430c2898fe0bdbfe669b31` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

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

- Issue: DarkFactoryTestORG/tyto-sandbox#79, mode `smoke`, attempt 2
- Branch: `tyto/79-smoke-recovery-202610261513` from `8c29b27bf550` (`dev` was `8c29b27bf550` when it was prepared)
- Cost: $0.04

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/79-smoke-recovery-202610261513 (fetched (19221e41e4d9)), base 8c29b27bf550 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 8c29b27bf550 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added an Unreleased entry for smoke run 202610261513: recovery (#79). |
| flow/smoke-check | smoke-check | done | Verified the one-line entry matches the Summary; no correction needed, and format checks pass. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at 8c29b27bf550 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for 074fef7d37ea |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://79-tyto-sandbox.localtest.me:8080/ for 074fef7d37ea (started in 4.3 s) |
| flow/smoke-evidence | smoke-evidence | done | evidence disabled in factory.yaml |

</details>
