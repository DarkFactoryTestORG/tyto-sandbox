# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/seed | done | 5403553ecdbe | database reset to the base snapshot |
| flow/baseline | done | 5403553ecdbe | baseline for 606dfb0efc97 from the warmer: no failing test |
| question/flow/smoke-edit/entry-wording | done | 5403553ecdbe | Should the changelog entry use the issue's Summary word for word, or a shorter wording? |
| flow/prepare | done | 5403553ecdbe | on tyto/103-smoke-clarification-202610262037 (fetched (ae194ac0d964)), base 606dfb0efc97 |
| flow/dev-servers | done | 5403553ecdbe | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/smoke-edit | done | 5403553ecdbe | Added a concise Unreleased entry for clarification smoke run 202610262037 (#103). |
| flow/smoke-check | done | 5403553ecdbe | Verified the one-line entry matches the Summary and requested shorter wording; format checks pass, with no changes needed. |
| flow/pr-open | done | 5403553ecdbe | draft PR open |
| flow/sync | done | 5403553ecdbe | up to date with dev at 606dfb0efc97 |
| flow/ledger | done | 5403553ecdbe | No feedback. 0 open (0 required) |
| flow/judge | skipped | 5403553ecdbe | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 5403553ecdbe | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 5403553ecdbe | 2 review image(s) built for f15473b60304 |
| flow/review-seed | done | 5403553ecdbe | database seeded with the review scenario review |
| flow/preview | done | 5403553ecdbe | preview at http://103-tyto-sandbox.localtest.me:8080/ for f15473b60304 (started in 3.9 s) |
| flow/smoke-evidence | done | 5403553ecdbe | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/103/4d9b5f3e5bfe662492a77688b17a909fead7cfb1/E1/smoke-lint.txt |
