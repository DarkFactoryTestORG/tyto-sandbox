## Summary

Smoke run 202610261929: recovery.

Refs #93. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #93`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 5854d5f8a148, dd13fb449514 |

## Decisions

None.

## Preview

http://93-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/15869dc992a83af20fdf19f8ec4b245175ff59a2/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 4 seconds (measured when this head started).

It serves `15869dc992a8`.

## Ledger

No feedback.

## Dismissals

None

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log, log | Lint passed: 10 successful tasks; smoke-edit check on unchanged application code.; Lint gate output for the delivered code | [2ea4119c61b8](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/93/2ea4119c61b81588713c825853cc8d9ecc03a57a/E1/smoke-lint.log) · [72e23870b1f2](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/93/72e23870b1f2e1fd894dbdb7e1973e392e17e436/E1/smoke-lint.txt) |

### Screenshots

| ID | Kind | Caption | Links |
|---|---|---|---|
| E2 | ui | Login page (/login) on the running web app; application unchanged from base. | [2ea4119c61b8](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/93/2ea4119c61b81588713c825853cc8d9ecc03a57a/E2/smoke-login.png) |

![Login page (/login) on the running web app; application unchanged from base.](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/93/2ea4119c61b81588713c825853cc8d9ecc03a57a/E2/smoke-login.png)

[E2: open image](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/93/2ea4119c61b81588713c825853cc8d9ecc03a57a/E2/smoke-login.png)

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:15869dc992a83af20fdf19f8ec4b245175ff59a2` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:15869dc992a83af20fdf19f8ec4b245175ff59a2` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

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

- Issue: DarkFactoryTestORG/tyto-sandbox#93, mode `smoke`, attempt 2
- Branch: `tyto/93-smoke-recovery-202610261929` from `2ea4119c61b8` (`dev` was `2ea4119c61b8` when it was prepared)
- Cost: $0.05

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/93-smoke-recovery-202610261929 (fetched (3ba65f9b25b0)), base 2ea4119c61b8 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 2ea4119c61b8 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added an Unreleased changelog entry for smoke run 202610261929: recovery (#93). |
| flow/smoke-check | smoke-check | done | Verified the one-line changelog entry matches the Summary; no correction needed, and formatting passes. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at 2ea4119c61b8 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for 15869dc992a8 |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://93-tyto-sandbox.localtest.me:8080/ for 15869dc992a8 (started in 4.0 s) |
| flow/smoke-evidence | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/93/72e23870b1f2e1fd894dbdb7e1973e392e17e436/E1/smoke-lint.txt |

</details>
