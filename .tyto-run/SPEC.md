<!-- spec-hash: 510cac55c41b7a156b6ce43116d8e026fe50151e9df8e0a59ef2d1789f63c491 -->
## Summary
Smoke run 202610260937: happy path.

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
| E1 | test | The lint and format gates pass with the new entry | R1 | pass |

<!-- smoke run 202610260937 -->
