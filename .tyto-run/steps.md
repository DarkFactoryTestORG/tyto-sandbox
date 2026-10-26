# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | 947db087f867 | on tyto/55-demo-background-colour-lavender (created at the base), base 8b530722c478 |
| flow/seed | done | 947db087f867 | database reset to the base snapshot |
| flow/baseline | done | 947db087f867 | baseline for 8b530722c478 from the warmer: no failing test |
| flow/demo-colour | done | 947db087f867 | Background set to #b39ddb (Lavender), with matching visible label; lint and format checks pass. |
| flow/pr-open | done | 947db087f867 | draft PR open |
| flow/sync | done | 947db087f867 | up to date with dev at 8b530722c478 |
| flow/ledger | done | 947db087f867 | No feedback. 0 open (0 required) |
| flow/judge | skipped | 947db087f867 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 947db087f867 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 947db087f867 | 2 review image(s) built for f7a9420eafd0 |
| flow/review-seed | done | 947db087f867 | database seeded with the review scenario review |
