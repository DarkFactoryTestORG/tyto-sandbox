# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/seed | done | e2922e6fe225 | database reset to the base snapshot |
| flow/baseline | done | e2922e6fe225 | baseline for 73aa23a7a2c4 from the warmer: no failing test |
| flow/smoke-edit | done | e2922e6fe225 | Added one Unreleased changelog entry for smoke run 202610261008: happy path (#62). |
| flow/pr-open | done | e2922e6fe225 | draft PR open |
| flow/sync | done | e2922e6fe225 | up to date with dev at 73aa23a7a2c4 |
| flow/ledger | done | e2922e6fe225 | No feedback. 0 open (0 required) |
| flow/judge | skipped | e2922e6fe225 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | e2922e6fe225 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | e2922e6fe225 | 2 review image(s) built for c66b6b4e894d |
| flow/review-seed | done | e2922e6fe225 | database seeded with the review scenario review |
| flow/preview | done | e2922e6fe225 | preview at http://62-tyto-sandbox.localtest.me:8080/ for c66b6b4e894d (started in 5.6 s) |
| flow/smoke-evidence | done | e2922e6fe225 | Captured E1: http://evidence.localtest.me:8080/evidence/DarkFactoryTestORG/tyto-sandbox/62/b4bce6be8eecc1d01e6774242de80efe2476e895/E1/smoke-lint.txt |
| flow/prepare | done | e2922e6fe225 | on tyto/62-smoke-happy-path-202610261008 (fetched (bbb83ed9f0bf)), base 2ea4119c61b8, run state restored from 2a49e1b4ff80 |
