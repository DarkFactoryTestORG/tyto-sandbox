## Summary

Make the preview obviously ours.

Refs #55. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #55`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Set the page background to #b39ddb | — | — |

## Requirement map

No commit names a requirement (Covers) yet.

## Decisions

None.

## Preview

http://55-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/f7a9420eafd06455ef0813379a9cf6c80b1d8fcd/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 18 seconds (measured when this head started).

It serves `f7a9420eafd0`.

## Ledger

No feedback.

## Dismissals

None

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:f7a9420eafd06455ef0813379a9cf6c80b1d8fcd` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:f7a9420eafd06455ef0813379a9cf6c80b1d8fcd` | `sha256:4a6ac274ea165bdb6d420d5ce6fb6bd2e40dd453ba55de75e8cbf2c3476f6bef` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Colour

Compare the [production demo (dev branch)](http://prod.localtest.me:3001/) with this PR’s preview linked above. These are separate local instances; PR changes appear only in the preview.

The issue asked for **Lavender** `#b39ddb`. The preview's page background is that colour, and the bar at the top of every page names it.

To try another colour, comment here (or on the issue), e.g. "Make the background Mint (#6fe3b4)". The factory wakes the PR, the Judge applies the change, and the preview and the bar follow; the Ledger below records the decision.

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#55, mode `demo`, attempt 1
- Branch: `tyto/55-demo-background-colour-lavender` from `8b530722c478` (`dev` was `8b530722c478` when it was prepared)
- Cost: $0.02

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/55-demo-background-colour-lavender (created at the base), base 8b530722c478 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/baseline | baseline | done | baseline for 8b530722c478 from the warmer: no failing test |
| flow/demo-colour | demo-colour | done | Background set to #b39ddb (Lavender), with matching visible label; lint and format checks pass. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at 8b530722c478 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for f7a9420eafd0 |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://55-tyto-sandbox.localtest.me:8080/ for f7a9420eafd0 (started in 17.6 s) |

</details>
