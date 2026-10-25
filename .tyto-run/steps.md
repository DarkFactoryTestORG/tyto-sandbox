# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/prepare | done | 429dfa90af53 | on tyto/48-demo-background-colour-ocean-blue (created at the base), base e9e85008652b |
| flow/seed | done | 429dfa90af53 | database reset to the base snapshot |
| flow/baseline | done | 429dfa90af53 | baseline for e9e85008652b from the warmer: no failing test |
| flow/demo-colour | done | 429dfa90af53 | Background set to #4fa3ff (Ocean blue) with a matching visible label; lint and formatting checks pass. |
| flow/pr-open | done | 429dfa90af53 | draft PR open |
| flow/sync | done | 429dfa90af53 | up to date with dev at e9e85008652b |
| flow/ledger | done | 429dfa90af53 | No feedback. 0 open (0 required) |
| flow/judge | skipped | 429dfa90af53 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | 429dfa90af53 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | 429dfa90af53 | 2 review image(s) built for 4a41534c427a |
