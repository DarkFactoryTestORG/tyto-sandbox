# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | f85106d42585 | on tyto/75-smoke-happy-path-202610261513 (created at the base), base 8c29b27bf550 |
| flow/seed | done | f85106d42585 | database reset to the base snapshot |
| flow/dev-servers | done | f85106d42585 | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/baseline | done | f85106d42585 | baseline for 8c29b27bf550 from the warmer: no failing test |
| flow/smoke-edit | done | f85106d42585 | Added an Unreleased entry for smoke run 202610261513’s happy path (#75). |
| flow/smoke-check | done | f85106d42585 | Verified the one-line changelog entry matches the Summary; no correction needed, and format checks pass. |
| flow/pr-open | done | f85106d42585 | draft PR open |
| flow/sync | done | f85106d42585 | up to date with dev at 8c29b27bf550 |
| flow/ledger | done | f85106d42585 | No feedback. 0 open (0 required) |
| flow/judge | skipped | f85106d42585 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | f85106d42585 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | f85106d42585 | 2 review image(s) built for e0861efccadf |
| flow/review-seed | done | f85106d42585 | database seeded with the review scenario review |
| flow/preview | done | f85106d42585 | preview at http://75-tyto-sandbox.localtest.me:8080/ for e0861efccadf (started in 5.0 s) |
