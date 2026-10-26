# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/seed | done | 9acda9425cb8 | database reset to the base snapshot |
| flow/baseline | done | 9acda9425cb8 | baseline for 8c29b27bf550 from the warmer: no failing test |
| flow/prepare | done | 9acda9425cb8 | on tyto/79-smoke-recovery-202610261513 (fetched (19221e41e4d9)), base 8c29b27bf550 |
| flow/dev-servers | done | 9acda9425cb8 | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/smoke-edit | done | 9acda9425cb8 | Added an Unreleased entry for smoke run 202610261513: recovery (#79). |
| flow/smoke-check | done | 9acda9425cb8 | Verified the one-line entry matches the Summary; no correction needed, and format checks pass. |
| flow/pr-open | done | 9acda9425cb8 | draft PR open |
| flow/sync | done | 9acda9425cb8 | up to date with dev at 8c29b27bf550 |
| flow/ledger | done | 9acda9425cb8 | No feedback. 0 open (0 required) |
| flow/judge | skipped | 9acda9425cb8 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 9acda9425cb8 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 9acda9425cb8 | 2 review image(s) built for 074fef7d37ea |
| flow/review-seed | done | 9acda9425cb8 | database seeded with the review scenario review |
