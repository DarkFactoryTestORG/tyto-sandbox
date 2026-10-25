# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | 429dfa90af53 | on tyto/51-demo-background-colour-ocean-blue (created at the base), base e9e85008652b |
| flow/seed | done | 429dfa90af53 | database reset to the base snapshot |
| flow/baseline | done | 429dfa90af53 | baseline for e9e85008652b from the warmer: no failing test |
| flow/demo-colour | done | 429dfa90af53 | Background set to #4fa3ff (Ocean blue) with a matching label; lint and format checks passed. |
| flow/pr-open | done | 429dfa90af53 | draft PR open |
| flow/sync | done | 429dfa90af53 | up to date with dev at e9e85008652b |
| flow/ledger | done | 429dfa90af53 | No feedback. 0 open (0 required) |
| flow/judge | skipped | 429dfa90af53 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 429dfa90af53 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 429dfa90af53 | 2 review image(s) built for 7938872b8ef5 |
| flow/review-seed | done | 429dfa90af53 | database seeded with the review scenario review |
| flow/preview | done | 429dfa90af53 | preview at http://51-tyto-sandbox.localtest.me:8080/ for 7938872b8ef5 (started in 4.6 s) |
