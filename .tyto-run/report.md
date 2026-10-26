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

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/d1e116c9e31a22aaa89c2b3d884bbaaed15c7d4e/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 5 seconds (measured when this head started).

It serves `d1e116c9e31a`.

## Ledger

3 items: 1 fixed, 2 dismissed.

| Source | Author | Item | State | Resolution |
|---|---|---|---|---|
| thread | @michaeltomlinsontuks | [Please use the past tense in this entry. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/90#discussion_r4381742335) | fixed | fixed in 5338d50 |
| thread | @michaeltomlinsontuks | [Also add a README section about the changelog. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/90#discussion_r4381742348) | dismissed | Scope explicitly marks “any other file, including the README” Out. Please propose the README changelog section in a follow-up issue. |
| thread | @michaeltomlinsontuks | [Rewrite every historic entry in the changelog into categories. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/90#discussion_r4381742358) | dismissed | Scope explicitly marks “changes to existing changelog entries” Out. Please propose categorizing historic entries in a follow-up issue. |

## Dismissals

| Item | Source | Why dismissed |
|---|---|---|
| [Also add a README section about the changelog. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/90#discussion_r4381742348) | thread by @michaeltomlinsontuks | Scope explicitly marks “any other file, including the README” Out. Please propose the README changelog section in a follow-up issue. |
| [Rewrite every historic entry in the changelog into categories. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/90#discussion_r4381742358) | thread by @michaeltomlinsontuks | Scope explicitly marks “changes to existing changelog entries” Out. Please propose categorizing historic entries in a follow-up issue. |

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log | Lint gate output for the delivered code | [a9b5700810e8](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/89/a9b5700810e8c398b26cbccf7073c38b9e5ebad6/E1/smoke-lint.txt) |

### Screenshots

None captured.

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:d1e116c9e31a22aaa89c2b3d884bbaaed15c7d4e` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:d1e116c9e31a22aaa89c2b3d884bbaaed15c7d4e` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

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

- Issue: DarkFactoryTestORG/tyto-sandbox#89, mode `smoke`, attempt 3
- Branch: `tyto/89-smoke-happy-path-202610261929` from `cf78b51ccbc8` (`dev` was `cf78b51ccbc8` when it was prepared)
- Cost: $0.07

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/89-smoke-happy-path-202610261929 (fetched (ff4fd9485c07)), base cf78b51ccbc8, run state restored from abfcc5cea9f2 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 2ea4119c61b8 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added one Unreleased changelog entry for smoke run 202610261929: happy path (#89). |
| flow/smoke-check | smoke-check | done | Verified the one-line entry matches the Summary; no correction needed, and format checks pass. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync@3 | sync | done | up to date with dev at cf78b51ccbc8 |
| flow/ledger@4 | ledger | done | 3 items: 3 open. 3 open (3 required) |
| flow/judge@3 | judge | done | round 3: 1 applied, 2 dismissed  Updated the new entry to past tense, dismissed two out-of-scope requests, and verified lint, typecheck, tests and formatting pass. |
| flow/ledger@5 | ledger | done | 3 items: 1 fixed, 2 dismissed. 0 open (0 required) |
| flow/judge@4 | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates@3 | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images@3 | review-images | done | 2 review image(s) built for d1e116c9e31a |
| flow/review-seed@3 | review-seed | done | database seeded with the review scenario review |
| flow/preview@3 | preview | done | preview at http://89-tyto-sandbox.localtest.me:8080/ for d1e116c9e31a (started in 4.7 s) |
| flow/smoke-evidence@3 | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/89/a9b5700810e8c398b26cbccf7073c38b9e5ebad6/E1/smoke-lint.txt |

</details>
