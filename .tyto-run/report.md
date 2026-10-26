## Summary

Smoke run 202610260937: happy path.

Refs #58. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #58`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 4af5a0308eb1 |

## Decisions

None.

## Preview

http://58-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/3b63dda053def67f3021fdae564ea9029ecd1ed8/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 4 seconds (measured when this head started).

It serves `3b63dda053de`.

## Ledger

No feedback.

## Dismissals

None

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:3b63dda053def67f3021fdae564ea9029ecd1ed8` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:3b63dda053def67f3021fdae564ea9029ecd1ed8` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Scope

- In: one new line in CHANGELOG.md under Unreleased
- Out: any other file, including the README; changes to existing changelog entries

## Evidence

- E1 (`test`): The lint and format gates pass with the new entry

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#58, mode `smoke`, attempt 1
- Branch: `tyto/58-smoke-happy-path-202610260937` from `73aa23a7a2c4` (`dev` was `73aa23a7a2c4` when it was prepared)
- Cost: $0.02

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/58-smoke-happy-path-202610260937 (created at the base), base 73aa23a7a2c4 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/baseline | baseline | done | baseline for 73aa23a7a2c4 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added one Unreleased changelog entry for smoke run 202610260937: happy path (#58). |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at 73aa23a7a2c4 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for 3b63dda053de |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://58-tyto-sandbox.localtest.me:8080/ for 3b63dda053de (started in 4.4 s) |

</details>
