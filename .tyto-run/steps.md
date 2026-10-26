# Steps

| Step | Status | Spec | Summary |
|---|---|---|---|
| flow/seed | done | a66487ef64b4 | database reset to the base snapshot |
| flow/baseline | done | a66487ef64b4 | baseline for cf78b51ccbc8 from the warmer: no failing test |
| question/flow/smoke-edit/entry-wording | done | a66487ef64b4 | Should the changelog entry use the issue's Summary word for word, or a shorter wording? |
| flow/prepare | done | a66487ef64b4 | on tyto/98-smoke-clarification-202610262012 (fetched (d93c9cf9ddaa)), base cf78b51ccbc8 |
| flow/dev-servers | done | a66487ef64b4 | ready: api http://127.0.0.1:4000, web http://127.0.0.1:3000 |
| flow/smoke-edit | done | a66487ef64b4 | Added a concise Unreleased entry for clarification smoke run 202610262012 (#98). |
| flow/smoke-check | done | a66487ef64b4 | Verified the one-line entry matches the Summary; no correction needed, and format passes. |
| flow/pr-open | done | a66487ef64b4 | draft PR open |
| flow/sync | done | a66487ef64b4 | up to date with dev at cf78b51ccbc8 |
| flow/ledger | done | a66487ef64b4 | No feedback. 0 open (0 required) |
| flow/judge | skipped | a66487ef64b4 | skipped: steps.ledger.open > 0 \|\| steps.ledger.conflicted is false |
| flow/final-gates | done | a66487ef64b4 | 4 gate(s) pass without remote cache reads: lint, format, typecheck, tests-all |
| flow/review-images | done | a66487ef64b4 | 2 review image(s) built for 23c5789bc02b |
| flow/review-seed | done | a66487ef64b4 | database seeded with the review scenario review |
| flow/preview | done | a66487ef64b4 | preview at http://98-tyto-sandbox.localtest.me:8080/ for 23c5789bc02b (started in 3.5 s) |
