<!-- spec-hash: e09b632f9765eda59322f6fee0cd6bc9adef03bfed2ac07857a6ae12bf40ced3 -->
## Summary
Smoke run 202610261444: happy path.

## Scope
In: one new line in CHANGELOG.md under Unreleased
Out: any other file, including the README; changes to existing changelog entries

## Requirements
| ID | Requirement |
|---|---|
| R1 | CHANGELOG.md has one new entry that describes this issue's Summary in one line |

## Tasks
### T1 — Add the changelog entry
| Satisfies | Depends on |
|---|---|
| R1 | none |

| Test | Level | Covers |
|---|---|---|
| Lint and format gates pass | integration | R1 |

Done when: the new entry passes the gates.

## Evidence
| ID | Capture | Steps | Shows | Expected |
|---|---|---|---|---|
| E1 | log | Capture the lint gate output with the new entry | R1 | pass |
| E2 | ui | Screenshot `/login` from the running web app with Playwright | R1 | the login page renders |

<!-- smoke run 202610261444 -->
