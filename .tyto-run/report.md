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

- **flow/judge**: The reviewer requested your explicit approval before merge. I applied the past-tense request: “Completed smoke run 202610262037: happy path (#101)”. Do you approve keeping this wording? The README request was dismissed because Scope explicitly excludes it. → skip it (@michaeltomlinsontuks)

## Preview

http://101-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/50fa39446507576717d945e05eb1437ec8244747/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 5 seconds (measured when this head started).

It serves `50fa39446507`.

## Ledger

4 items: 1 fixed, 3 dismissed.

| Source | Author | Item | State | Resolution |
|---|---|---|---|---|
| thread | @michaeltomlinsontuks | [Please use the past tense in this entry. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/102#discussion_r4382329844) | fixed | fixed in 531c6c3 |
| thread | @michaeltomlinsontuks | [Also add a README section about the changelog. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/102#discussion_r4382329854) | dismissed | Scope explicitly marks “any other file, including the README” Out; please propose README documentation in a follow-up issue. |
| thread | @michaeltomlinsontuks | [The issue owner must confirm the exact wording of this entry before it merges. Please ask them whether to keep it as it… (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/102#discussion_r4382329863) | dismissed | Asked the owner for explicit wording approval; the owner answered “skip it”, so no further approval step is required. |
| comment | @michaeltomlinsontuks | [on the issue: skip it](https://github.com/DarkFactoryTestORG/tyto-sandbox/issues/101#issuecomment-6427089543) | dismissed | Acknowledged as the answer to the earlier wording-approval question; no additional code change is requested. |

## Dismissals

| Item | Source | Why dismissed |
|---|---|---|
| [Also add a README section about the changelog. (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/102#discussion_r4382329854) | thread by @michaeltomlinsontuks | Scope explicitly marks “any other file, including the README” Out; please propose README documentation in a follow-up issue. |
| [The issue owner must confirm the exact wording of this entry before it merges. Please ask them whether to keep it as it… (`CHANGELOG.md:9`)](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/102#discussion_r4382329863) | thread by @michaeltomlinsontuks | Asked the owner for explicit wording approval; the owner answered “skip it”, so no further approval step is required. |
| [on the issue: skip it](https://github.com/DarkFactoryTestORG/tyto-sandbox/issues/101#issuecomment-6427089543) | comment by @michaeltomlinsontuks | Acknowledged as the answer to the earlier wording-approval question; no additional code change is requested. |

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log | Lint gate output for the delivered code | [2df897589f80](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/101/2df897589f8067388118e4ae70701c4a2d23dd4d/E1/smoke-lint.txt) |

### Screenshots

None captured.

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:50fa39446507576717d945e05eb1437ec8244747` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:50fa39446507576717d945e05eb1437ec8244747` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

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

- Issue: DarkFactoryTestORG/tyto-sandbox#101, mode `smoke`, attempt 4
- Branch: `tyto/101-smoke-happy-path-202610262037` from `374e7072ff30` (`dev` was `374e7072ff30` when it was prepared)
- Cost: $0.08

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/101-smoke-happy-path-202610262037 (fetched (701fba641ee3)), base 374e7072ff30 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 606dfb0efc97 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added one Unreleased entry for smoke run 202610262037: happy path (#101). |
| flow/smoke-check | smoke-check | done | Verified the one-line changelog entry matches the Summary; no correction needed, and formatting passes. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync@3 | sync | done | up to date with dev at 374e7072ff30 |
| flow/ledger@4 | ledger | done | 3 items: 3 open. 3 open (3 required) |
| flow/judge@3 | judge | done | round 3: 1 applied, 2 dismissed  Updated the entry to past tense, dismissed README work as out of scope, and honored the owner's request to skip approval; all gates pass. |
| flow/ledger@5 | ledger | done | 4 items: 1 open, 1 fixed, 2 dismissed. 1 open (1 required) |
| flow/judge@4 | judge | done | round 4: 1 dismissed  Acknowledged the owner's reply without further changes; lint, typecheck, and tests pass with seven clean JUnit reports. |
| flow/final-gates@3 | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images@3 | review-images | done | 2 review image(s) built for 50fa39446507 |
| flow/review-seed@3 | review-seed | done | database seeded with the review scenario review |
| flow/preview@3 | preview | done | preview at http://101-tyto-sandbox.localtest.me:8080/ for 50fa39446507 (started in 4.8 s) |
| flow/smoke-evidence@3 | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/101/2df897589f8067388118e4ae70701c4a2d23dd4d/E1/smoke-lint.txt |

</details>
