## Summary

The changelog records that developers can draft and lint factory issues through the generated factory-spec skill, built on the phase 16 issue grammar toolkit.

Refs #60. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #60`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 271e14b9b3ac |
| R1.e1 | 271e14b9b3ac |
| R1.e2 | 271e14b9b3ac |

## Decisions

None.

## Preview

http://60-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/bd646590f1f7cadf823706506a53e493c936f766/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 4 seconds (measured when this head started).

It serves `bd646590f1f7`.

## Ledger

No feedback.

## Dismissals

None

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:bd646590f1f7cadf823706506a53e493c936f766` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:bd646590f1f7cadf823706506a53e493c936f766` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Scope

- In: one new line in CHANGELOG.md under Unreleased
- Out: any other file; changes to existing changelog entries

## Evidence

- E1 (`test`): The lint, format and changelog-format gates pass with the new entry
- E2 (`cli`): Show the diff stat against the base branch

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#60, mode `smoke`, attempt 1
- Branch: `tyto/60-changelog-draft-and-lint-factory-issues` from `73aa23a7a2c4` (`dev` was `73aa23a7a2c4` when it was prepared)
- Cost: $0.02

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/60-changelog-draft-and-lint-factory-issues (created at the base), base 73aa23a7a2c4 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/baseline | baseline | done | baseline for 73aa23a7a2c4 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added an Unreleased entry describing drafting and linting factory issues through the generated factory-spec skill (#60). |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at 73aa23a7a2c4 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for bd646590f1f7 |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://60-tyto-sandbox.localtest.me:8080/ for bd646590f1f7 (started in 4.3 s) |

</details>
