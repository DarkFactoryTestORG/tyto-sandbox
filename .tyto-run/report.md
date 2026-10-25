## Summary

Make the preview obviously ours.

Refs #51. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #51`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Set the page background to #4fa3ff | — | — |

## Requirement map

No commit names a requirement (Covers) yet.

## Decisions

None.

## Preview

http://51-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/712392b09e4518f6d83ccd2760739e5443deba8d/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 12 seconds (measured when this head started).

It serves `712392b09e45`.

## Ledger

1 item: 1 fixed.

| Source | Author | Item | State | Resolution |
|---|---|---|---|---|
| comment | @michaeltomlinsontuks | [make the background colour mint](https://github.com/DarkFactoryTestORG/tyto-sandbox/pull/52#issuecomment-6401363812) | fixed | fixed in da76dbe |

## Dismissals

None

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:712392b09e4518f6d83ccd2760739e5443deba8d` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:712392b09e4518f6d83ccd2760739e5443deba8d` | `sha256:3460384b5747564d0b07cb0e5c707038afb809bf68b0c2f91dae730466652ada` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Colour

Compare the [production demo (dev branch)](http://prod.localtest.me:3001/) with this PR’s preview linked above. These are separate local instances; PR changes appear only in the preview.

The issue asked for **Ocean blue** `#4fa3ff`. The preview's page background is that colour, and the bar at the top of every page names it.

To try another colour, comment here (or on the issue), e.g. "Make the background Mint (#6fe3b4)". The factory wakes the PR, the Judge applies the change, and the preview and the bar follow; the Ledger below records the decision.

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#51, mode `demo`, attempt 2
- Branch: `tyto/51-demo-background-colour-ocean-blue` from `e9e85008652b` (`dev` was `e9e85008652b` when it was prepared)
- Cost: $0.02

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/51-demo-background-colour-ocean-blue (fetched (6aed03499cc9)), base e9e85008652b, run state restored from 2027dfffcabd |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/baseline | baseline | done | baseline for e9e85008652b from the warmer: no failing test |
| flow/demo-colour | demo-colour | done | Background set to #4fa3ff (Ocean blue) with a matching label; lint and format checks passed. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync@2 | sync | done | up to date with dev at e9e85008652b |
| flow/ledger@2 | ledger | done | 1 item: 1 open. 1 open (1 required) |
| flow/judge@2 | judge | done | round 2: 1 applied  Changed the background and label to mint (#98ff98); lint, typecheck, and all tests pass with no JUnit failures. |
| flow/ledger@3 | ledger | done | 1 item: 1 fixed. 0 open (0 required) |
| flow/judge@3 | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates@2 | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images@2 | review-images | done | 2 review image(s) built for 712392b09e45 |
| flow/review-seed@2 | review-seed | done | database seeded with the review scenario review |
| flow/preview@2 | preview | done | preview at http://51-tyto-sandbox.localtest.me:8080/ for 712392b09e45 (started in 12.3 s) |

</details>
