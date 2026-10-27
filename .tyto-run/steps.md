# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | 429dfa90af53 | on tyto/106-demo-background-colour-ocean-blue (created at the base), base 374e7072ff30 |
| flow/seed | done | 429dfa90af53 | database reset to the base snapshot |
| flow/baseline | done | 429dfa90af53 | baseline for 374e7072ff30 from the warmer: no failing test |
| flow/demo-colour | done | 429dfa90af53 | Background set to #4fa3ff (Ocean blue) with matching label; lint and format checks pass. |
| flow/pr-open | done | 429dfa90af53 | draft PR open |
| flow/sync | done | 429dfa90af53 | up to date with dev at 374e7072ff30 |
| flow/ledger | done | 429dfa90af53 | No feedback. 0 open (0 required) |
| flow/judge | skipped | 429dfa90af53 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 429dfa90af53 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 429dfa90af53 | 2 review image(s) built for 578108732b98 |
| flow/review-seed | done | 429dfa90af53 | database seeded with the review scenario review |
| flow/preview | done | 429dfa90af53 | preview at http://106-tyto-sandbox.localtest.me:8080/ for 578108732b98 (started in 5.1 s) |
