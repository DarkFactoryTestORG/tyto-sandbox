# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | 6ba1b31efcdb | on tyto/96-smoke-happy-path-202610262012 (created at the base), base cf78b51ccbc8 |
| flow/seed | done | 6ba1b31efcdb | database reset to the base snapshot |
| flow/dev-servers | done | 6ba1b31efcdb | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | done | 6ba1b31efcdb | baseline for cf78b51ccbc8 from the warmer: no failing test |
| flow/smoke-edit | done | 6ba1b31efcdb | Added an Unreleased entry for smoke run 202610262012: happy path (#96). |
| flow/smoke-check | done | 6ba1b31efcdb | Verified the one-line entry matches the Summary; no correction needed, and format checks passed. |
| flow/pr-open | done | 6ba1b31efcdb | draft PR open |
| flow/sync | done | 6ba1b31efcdb | up to date with dev at cf78b51ccbc8 |
| flow/ledger | done | 6ba1b31efcdb | No feedback. 0 open (0 required) |
| flow/judge | skipped | 6ba1b31efcdb | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 6ba1b31efcdb | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 6ba1b31efcdb | 2 review image(s) built for 67459b54e143 |
| flow/review-seed | done | 6ba1b31efcdb | database seeded with the review scenario review |
| flow/preview | done | 6ba1b31efcdb | preview at http://96-tyto-sandbox.localtest.me:8080/ for 67459b54e143 (started in 4.1 s) |
| flow/smoke-evidence | done | 6ba1b31efcdb | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/96/ab2984451a0ad6a3e8b62d2763f36f2b406af5b7/E1/smoke-lint.txt |
