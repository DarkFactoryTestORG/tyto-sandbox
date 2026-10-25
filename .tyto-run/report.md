## Summary

Make the preview obviously ours.

Refs #48. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #48`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Set the page background to #4fa3ff | — | — |

## Requirement map

No commit names a requirement (Covers) yet.

## Decisions

None.

## Preview

http://48-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo prints it (PREVIEW_PASSWORD in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/4a41534c427afbfc963fea84241e801ee54eba91/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 11 seconds (measured when this head started).

It serves `4a41534c427a`.

## Ledger

No feedback.

## Dismissals

None

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:4a41534c427afbfc963fea84241e801ee54eba91` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:4a41534c427afbfc963fea84241e801ee54eba91` | `sha256:61cc8fd74a8727063a58216016989a9cecaf5484592fe8541e2ce76f48b0c940` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Colour

The issue asked for **Ocean blue** `#4fa3ff`. The preview's page background is that colour, and the bar at the top of every page names it.

To try another colour, comment here (or on the issue), e.g. "Make the background Mint (#6fe3b4)". The factory wakes the PR, the Judge applies the change, and the preview and the bar follow; the Ledger below records the decision.

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#48, mode `demo`, attempt 1
- Branch: `tyto/48-demo-background-colour-ocean-blue` from `e9e85008652b` (`dev` was `e9e85008652b` when it was prepared)
- Cost: $0.02

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/48-demo-background-colour-ocean-blue (created at the base), base e9e85008652b |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/baseline | baseline | done | baseline for e9e85008652b from the warmer: no failing test |
| flow/demo-colour | demo-colour | done | Background set to #4fa3ff (Ocean blue) with a matching visible label; lint and formatting checks pass. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at e9e85008652b |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for 4a41534c427a |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://48-tyto-sandbox.localtest.me:8080/ for 4a41534c427a (started in 10.9 s) |

</details>
