<!-- spec-hash: 171a075e83d256f25fdb48d0ef4f61b7f224f8432deded3da2fb5c22e9b36ea4 -->
## Summary
The changelog records that developers can draft and lint factory issues through the generated factory-spec skill, built on the phase 16 issue grammar toolkit.

## Scope
In: one new line in CHANGELOG.md under Unreleased
Out: any other file; changes to existing changelog entries

## Requirements
| ID | Requirement |
|---|---|
| R1 | CHANGELOG.md has one new entry under Unreleased that says, in one line, that developers can draft and lint factory issues through the generated factory-spec skill |
| R1.e1 | The new entry follows the changelog's format: written for a user and ending with this issue's number as `(#n)` |
| R1.e2 | No existing changelog entry is changed, reordered or removed |

## Tasks
### T1 — Add the changelog entry
| Satisfies | Depends on |
|---|---|
| R1, R1.e1, R1.e2 | none |

| Test | Level | Covers |
|---|---|---|
| Lint, format and changelog-format gates pass | integration | R1, R1.e1 |
| The diff adds exactly one line to CHANGELOG.md and touches no other file | integration | R1.e2 |

Done when: the new entry passes the gates and is the only change in the diff.

## Evidence
| ID | Capture | Steps | Shows | Expected |
|---|---|---|---|---|
| E1 | test | The lint, format and changelog-format gates pass with the new entry | R1, R1.e1 | pass |
| E2 | cli | Show the diff stat against the base branch | R1.e2 | one insertion in CHANGELOG.md and no other files changed |
