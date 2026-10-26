## Summary

Smoke run 202610262037: clarification.

Refs #103. This PR targets `dev` and does not close the issue when merged. If it should, say so here and the factory will switch it to `Closes #103`.

## Tasks

| Task | Title | Commits | Covers |
|---|---|---|---|
| T1 | Add the changelog entry | — | — |

## Requirement map

| Requirement | Commits |
|---|---|
| R1 | 1407b89fb5c4, a4fd32708a2a |

## Decisions

- **flow/smoke-edit**: Should the changelog entry use the issue's Summary word for word, or a shorter wording? → Shorter

## Preview

http://103-tyto-sandbox.localtest.me:8080/

Sign in to the preview with the shared credentials from make demo-help (PREVIEW_AUTH file in .demo.env).

Then sign in to the app with a review account: [packages/db/seeds/review/README.md](https://github.com/DarkFactoryTestORG/tyto-sandbox/blob/f15473b603042e1165c327309ac97b85b94257b8/packages/db/seeds/review/README.md).

The preview sleeps after 15 minutes without requests and wakes on the next one, in about 4 seconds (measured when this head started).

It serves `f15473b60304`.

## Ledger

No feedback.

## Dismissals

None

## Evidence

### Logs

| ID | Kind | Caption | Links |
|---|---|---|---|
| E1 | log, log | Lint passed with 10 successful tasks; captured against the pushed base SHA.; Lint gate output for the delivered code | [606dfb0efc97](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/103/606dfb0efc9769cec21d71ec11c34ca83f3baae3/E1/smoke-lint.log) · [4d9b5f3e5bfe](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/103/4d9b5f3e5bfe662492a77688b17a909fead7cfb1/E1/smoke-lint.txt) |

### Screenshots

| ID | Kind | Caption | Links |
|---|---|---|---|
| E2 | ui | Login page (/login) on the running web app. | [606dfb0efc97](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/103/606dfb0efc9769cec21d71ec11c34ca83f3baae3/E2/smoke-login.png) |

![Login page (/login) on the running web app.](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/103/606dfb0efc9769cec21d71ec11c34ca83f3baae3/E2/smoke-login.png)

[E2: open image](http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/103/606dfb0efc9769cec21d71ec11c34ca83f3baae3/E2/smoke-login.png)

Credentials: make demo-help (PREVIEW_AUTH file in .demo.env).

## Images

| App | Image | Digest |
|---|---|---|
| api | `ghcr.io/darkfactorytestorg/tyto-sandbox-api:f15473b603042e1165c327309ac97b85b94257b8` | `sha256:a653d18e52d7a85e05df4212ca64b525054b9b14cec3a691bf2751b25dd218cd` |
| web | `ghcr.io/darkfactorytestorg/tyto-sandbox-web:f15473b603042e1165c327309ac97b85b94257b8` | `sha256:87e92813ec649f239d66a5fe8580c21dd681348543ba6cf009865a439d4db36d` |

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

- Issue: DarkFactoryTestORG/tyto-sandbox#103, mode `smoke`, attempt 2
- Branch: `tyto/103-smoke-clarification-202610262037` from `606dfb0efc97` (`dev` was `606dfb0efc97` when it was prepared)
- Cost: $0.04

| Step | Brick | Status | Summary |
|---|---|---|---|
| flow/prepare | prepare | done | on tyto/103-smoke-clarification-202610262037 (fetched (ae194ac0d964)), base 606dfb0efc97 |
| flow/seed | seed | done | database reset to the base snapshot |
| flow/dev-servers | dev-servers | done | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | baseline | done | baseline for 606dfb0efc97 from the warmer: no failing test |
| flow/smoke-edit | smoke-edit | done | Added a concise Unreleased entry for clarification smoke run 202610262037 (#103). |
| flow/smoke-check | smoke-check | done | Verified the one-line entry matches the Summary and requested shorter wording; format checks pass, with no changes needed. |
| flow/pr-open | pr-open | done | draft PR open |
| flow/sync | sync | done | up to date with dev at 606dfb0efc97 |
| flow/ledger | ledger | done | No feedback. 0 open (0 required) |
| flow/judge | judge | skipped | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | final-gates | done | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | review-images | done | 2 review image(s) built for f15473b60304 |
| flow/review-seed | review-seed | done | database seeded with the review scenario review |
| flow/preview | preview | done | preview at http://103-tyto-sandbox.localtest.me:8080/ for f15473b60304 (started in 3.9 s) |
| flow/smoke-evidence | smoke-evidence | done | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/103/4d9b5f3e5bfe662492a77688b17a909fead7cfb1/E1/smoke-lint.txt |

</details>
