---
name: smoke-tight
about: "Smoke issue template: Summary, Scope, Requirements, Tasks, Evidence;
  [tyto:smoke:*] indicators switch test fragments on"
title: "[smoke-tight] "
labels:
  - kind:smoke-tight
---
<!-- Replace the summary and keep the five section headings. Do not include secrets. -->
## Summary
Record this issue in the changelog.

## Scope
In: one new line in CHANGELOG.md under Unreleased
Out: any other file; changes to existing changelog entries

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
