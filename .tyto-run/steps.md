# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | 171a075e83d2 | on tyto/60-changelog-draft-and-lint-factory-issues (created at the base), base 73aa23a7a2c4 |
| flow/seed | done | 171a075e83d2 | database reset to the base snapshot |
| flow/baseline | done | 171a075e83d2 | baseline for 73aa23a7a2c4 from the warmer: no failing test |
| flow/smoke-edit | done | 171a075e83d2 | Added an Unreleased entry describing drafting and linting factory issues through the generated factory-spec skill (#60). |
| flow/pr-open | done | 171a075e83d2 | draft PR open |
| flow/sync | done | 171a075e83d2 | up to date with dev at 73aa23a7a2c4 |
| flow/ledger | done | 171a075e83d2 | No feedback. 0 open (0 required) |
| flow/judge | skipped | 171a075e83d2 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 171a075e83d2 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 171a075e83d2 | 2 review image(s) built for bd646590f1f7 |
| flow/review-seed | done | 171a075e83d2 | database seeded with the review scenario review |
