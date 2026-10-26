<!-- spec-hash: 7873ee1166f7566c60a7231df56f3197e23c1dca914f67b1f198edb584c53432 -->
## Summary
Smoke run 202610261448: clarification.

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

<!-- smoke run 202610261448 [tyto:smoke:clarify] -->
