## Summary

Smoke run 202610261929: clarification.

Refs #91. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #91`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 6cefafab889a, 940d3854ed53 |

## Decisions

None.

## Preview

http://91-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/a471e1d27e0ed312ef2c7b365a4bd5cc92f98c37/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 5 seconds (measured when this head started).

It serves `a471e1d27e0e`.

## Ledger

No feedback.

## Dismissals

None

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log, log | pnpm turbo run lint passed: 10 successful tasks (smoke-edit workspace).; Lint gate output for the delivered code | [2ea4119c61b8](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/91/2ea4119c61b81588713c825853cc8d9ecc03a57a/E1/smoke-lint.log) · [6e1759ce6e33](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/91/6e1759ce6e33a24a6eaa1f7a6b85768ea0b7f892/E1/smoke-lint.txt) |

### Screenshots

| ID | Kind | Caption | Links |
|---|---|---|---|
| E2 | ui | Login page at /login on the running web app. | [2ea4119c61b8](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/91/2ea4119c61b81588713c825853cc8d9ecc03a57a/E2/smoke-login.png) |

![Login page at /login on the running web app.](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/91/2ea4119c61b81588713c825853cc8d9ecc03a57a/E2/smoke-login.png)

[E2: open image](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/91/2ea4119c61b81588713c825853cc8d9ecc03a57a/E2/smoke-login.png)

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:a471e1d27e0ed312ef2c7b365a4bd5cc92f98c37` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:a471e1d27e0ed312ef2c7b365a4bd5cc92f98c37` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Scope

In: one new line in CHANGELOG.md under Unreleased
Out: any other file, including the README; changes to existing changelog entries

## Evidence requested

- E1 (`log`): Capture the lint gate output with the new entry
- E2 (`ui`): Screenshot /login from the running web app with Playwright

## Smoke indicators

- `[tyto:smoke:clarify]`

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#91, mode `smoke`, attempt 2
- Branch: `tyto/91-smoke-clarification-202610261929` from `2ea4119c61b8` (`dev` was `2ea4119c61b8` when it was prepared)
- Cost: $0.04

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/91-smoke-clarification-202610261929 (fetched (f08a43d810b6)), base 2ea4119c61b8 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 2ea4119c61b8 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added a concise Unreleased entry for clarification smoke run 202610261929 (#91). |
| flow/smoke-check | smoke-check | done | Verified the one-line entry matches the Summary; no correction needed, and formatting passes. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at 2ea4119c61b8 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for a471e1d27e0e |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://91-tyto-sandbox.localtest.me:8080/ for a471e1d27e0e (started in 5.1 s) |
| flow/smoke-evidence | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/91/6e1759ce6e33a24a6eaa1f7a6b85768ea0b7f892/E1/smoke-lint.txt |

</details>
