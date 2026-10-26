## Summary

Smoke run 202610262012: happy path.

Refs #96. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #96`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 569b4f71ac1a, 6fbe8766599f |

## Decisions

None.

## Preview

http://96-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/3e85e3ff2f1c6bee46d167fdf473b85043efc1d7/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 5 seconds (measured when this head started).

It serves `3e85e3ff2f1c`.

## Ledger

3 items: 1 fixed, 2 dismissed.

| Source | Author | Item | State | Resolution |
|---|---|---|---|---|
| thread | @michaeltomlinsontuks | [Please use the past tense in this entry. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/97#discussion_r4382090182) | fixed | fixed in 1fbfb7a |
| thread | @michaeltomlinsontuks | [Also add a README section about the changelog. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/97#discussion_r4382090191) | dismissed | Scope explicitly says “Out: any other file, including the README”; please open a follow-up issue for a README section about the changelog. |
| thread | @michaeltomlinsontuks | [Should this entry be written for end users or for developers? Nothing decides who the changelog is for: please check wi… (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/97#discussion_r4382090197) | dismissed | The existing CHANGELOG.md introduction already specifies the audience: “what changed, for a user”; this entry follows that established end-user convention. |

## Dismissals

| Item | Source | Why dismissed |
|---|---|---|
| [Also add a README section about the changelog. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/97#discussion_r4382090191) | thread by @michaeltomlinsontuks | Scope explicitly says “Out: any other file, including the README”; please open a follow-up issue for a README section about the changelog. |
| [Should this entry be written for end users or for developers? Nothing decides who the changelog is for: please check wi… (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/97#discussion_r4382090197) | thread by @michaeltomlinsontuks | The existing CHANGELOG.md introduction already specifies the audience: “what changed, for a user”; this entry follows that established end-user convention. |

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log | Lint gate output for the delivered code | [eee8a6d57ab4](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/96/eee8a6d57ab4f0f732bc0bafafda6e3bfb0d549e/E1/smoke-lint.txt) |

### Screenshots

None captured.

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:3e85e3ff2f1c6bee46d167fdf473b85043efc1d7` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:3e85e3ff2f1c6bee46d167fdf473b85043efc1d7` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

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

- Issue: DarkFactoryTestORG/tyto-sandbox#96, mode `smoke`, attempt 3
- Branch: `tyto/96-smoke-happy-path-202610262012` from `606dfb0efc97` (`dev` was `606dfb0efc97` when it was prepared)
- Cost: $0.05

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/96-smoke-happy-path-202610262012 (fetched (f9440d268e4a)), base 606dfb0efc97, run state restored from 011336dd22d9 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for cf78b51ccbc8 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added an Unreleased entry for smoke run 202610262012: happy path (#96). |
| flow/smoke-check | smoke-check | done | Verified the one-line entry matches the Summary; no correction needed, and format checks passed. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync@3 | sync | done | up to date with dev at 606dfb0efc97 |
| flow/ledger@4 | ledger | done | 3 items: 3 open. 3 open (3 required) |
| flow/judge@3 | judge | done | round 3: 1 applied, 2 dismissed  Updated the new entry to past tense; dismissed README work as out of scope and audience question as already answered by the changelog introduction. Lint, typecheck, tests and formatting pass. |
| flow/ledger@5 | ledger | done | 3 items: 1 fixed, 2 dismissed. 0 open (0 required) |
| flow/judge@4 | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates@3 | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images@3 | review-images | done | 2 review image(s) built for 3e85e3ff2f1c |
| flow/review-seed@3 | review-seed | done | database seeded with the review scenario review |
| flow/preview@3 | preview | done | preview at http://96-tyto-sandbox.localtest.me:8080/ for 3e85e3ff2f1c (started in 5.1 s) |
| flow/smoke-evidence@3 | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/96/eee8a6d57ab4f0f732bc0bafafda6e3bfb0d549e/E1/smoke-lint.txt |

</details>
