## Summary

Smoke run 202610250845: happy path.

Refs #45. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #45`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | c4c248bcdfaf |

## Decisions

None.

## Preview

http://45-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from Local verification shared credential.

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/52d543e5f6744d8c30a3a0294de18ae5a935d24f/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 74 seconds (measured when this head started).

It serves `52d543e5f674`.

## Ledger

No feedback.

## Dismissals

None

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:52d543e5f6744d8c30a3a0294de18ae5a935d24f` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:52d543e5f6744d8c30a3a0294de18ae5a935d24f` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Scope

- In: one new line in CHANGELOG.md under Unreleased
- Out: any other file, including the README; changes to existing changelog entries

## Evidence

- E1 (`test`): The lint and format gates pass with the new entry

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#45, mode `smoke`, attempt 1
- Branch: `tyto/45-smoke-happy-path-202610250845` from `e9e85008652b` (`dev` was `e9e85008652b` when it was prepared)
- Cost: $0.02

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/45-smoke-happy-path-202610250845 (created at the base), base e9e85008652b |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/baseline | baseline | done | baseline for e9e85008652b from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added an Unreleased changelog entry for smoke run 202610250845: happy path (#45). |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at e9e85008652b |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for 52d543e5f674 |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://45-tyto-sandbox.localtest.me:8080/ for 52d543e5f674 (started in 74.1 s) |

</details>
