# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | a9fec7e354ef | on tyto/89-smoke-happy-path-202610261929 (created at the base), base 2ea4119c61b8 |
| flow/seed | done | a9fec7e354ef | database reset to the base snapshot |
| flow/dev-servers | done | a9fec7e354ef | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | done | a9fec7e354ef | baseline for 2ea4119c61b8 from the warmer: no failing test |
| flow/smoke-edit | done | a9fec7e354ef | Added one Unreleased changelog entry for smoke run 202610261929: happy path (#89). |
| flow/smoke-check | done | a9fec7e354ef | Verified the one-line entry matches the Summary; no correction needed, and format checks pass. |
| flow/pr-open | done | a9fec7e354ef | draft PR open |
| flow/sync | done | a9fec7e354ef | up to date with dev at 2ea4119c61b8 |
| flow/ledger | done | a9fec7e354ef | No feedback. 0 open (0 required) |
| flow/judge | skipped | a9fec7e354ef | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | a9fec7e354ef | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | a9fec7e354ef | 2 review image(s) built for 8b43085b6442 |
| flow/review-seed | done | a9fec7e354ef | database seeded with the review scenario review |
| flow/preview | done | a9fec7e354ef | preview at http://89-tyto-sandbox.localtest.me:8080/ for 8b43085b6442 (started in 4.2 s) |
