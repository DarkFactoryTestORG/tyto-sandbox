## Summary

Smoke run 202610262012: clarification.

Refs #98. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #98`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 7bddc39c1789, 8d7da8966a71 |

## Decisions

- **flow/smoke-edit**: Should the changelog entry use the issue's Summary word for word, or a shorter wording? → Shorter

## Preview

http://98-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/23c5789bc02b12d23f12f3d82f523dab0510992d/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 3 seconds (measured when this head started).

It serves `23c5789bc02b`.

## Ledger

No feedback.

## Dismissals

None

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log, log | pnpm turbo run lint passed with 10 successful tasks; preliminary smoke-edit evidence.; Lint gate output for the delivered code | [cf78b51ccbc8](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/98/cf78b51ccbc8267527529f3abedc8c85bbfe8909/E1/smoke-lint.log) · [c50f7b39615c](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/98/c50f7b39615cc88ceb5205d73d0e600862c7e04a/E1/smoke-lint.txt) |

### Screenshots

| ID | Kind | Caption | Links |
|---|---|---|---|
| E2 | ui | Login page (/login) on the running web app. | [cf78b51ccbc8](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/98/cf78b51ccbc8267527529f3abedc8c85bbfe8909/E2/smoke-login.png) |

![Login page (/login) on the running web app.](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/98/cf78b51ccbc8267527529f3abedc8c85bbfe8909/E2/smoke-login.png)

[E2: open image](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/98/cf78b51ccbc8267527529f3abedc8c85bbfe8909/E2/smoke-login.png)

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:23c5789bc02b12d23f12f3d82f523dab0510992d` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:23c5789bc02b12d23f12f3d82f523dab0510992d` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

The preview's database holds the `review` seed. Accounts to sign in with: `packages/db/seeds/review/README.md`.

## Scope

In: one new line in CHANGELOG.md under Unreleased
Out: any other file, including the README; changes to existing changelog entries

## Evidence requested

- E1 (`log`): Capture the lint gate output with the new entry
- E2 (`ui`): Screenshot /login from the running web app with Playwright

## Smoke indicators

- `[tyto:smoke:clarify]`

## Risks & rollback

The issue states no risks or rollback.

<details><summary>Run details</summary>

- Issue: DarkFactoryTestORG/tyto-sandbox#98, mode `smoke`, attempt 2
- Branch: `tyto/98-smoke-clarification-202610262012` from `cf78b51ccbc8` (`dev` was `cf78b51ccbc8` when it was prepared)
- Cost: $0.06

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/98-smoke-clarification-202610262012 (fetched (d93c9cf9ddaa)), base cf78b51ccbc8 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for cf78b51ccbc8 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added a concise Unreleased entry for clarification smoke run 202610262012 (#98). |
| flow/smoke-check | smoke-check | done | Verified the one-line entry matches the Summary; no correction needed, and format passes. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at cf78b51ccbc8 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for 23c5789bc02b |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://98-tyto-sandbox.localtest.me:8080/ for 23c5789bc02b (started in 3.5 s) |
| flow/smoke-evidence | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/98/c50f7b39615cc88ceb5205d73d0e600862c7e04a/E1/smoke-lint.txt |

</details>
