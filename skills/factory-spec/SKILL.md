---
name: factory-spec
description: Spec an issue, write a factory issue, or run /factory-spec. Interviews the developer using the repo's issue types, lints the draft and creates a GitHub issue in Draft.
---

# Factory spec

Use the developer's own agent and GitHub identity. The CLI makes no model calls.

| Type | When to use | Interview |
|---|---|---|
| demo | Demo issue template: a page background colour for Plotline (a preset or a hex), visible in the preview | [Guide](types/demo.md) |
| smoke | Smoke issue template: Summary, Scope, Requirements, Tasks, Evidence; [tyto:smoke:*] indicators switch test fragments on | [Guide](types/smoke.md) |
| smoke-tight | Smoke issue template: Summary, Scope, Requirements, Tasks, Evidence; [tyto:smoke:*] indicators switch test fragments on | [Guide](types/smoke-tight.md) |

1. Pick the closest type from the request and explain why. If unclear, ask the developer to choose between the closest two. If the request contains separate work, explain that and spec the first piece.
2. Read only the selected `types/<mode>.md` file.
3. Interview a few questions at a time, following its guide. Read the code and repository standards yourself. Express intent in the issue; do not ask the developer for implementation paths. Pin down edge cases, failure modes and fixtures. Never copy secrets or seed values from the developer's environment into a public issue.
4. Draft in a temporary markdown file using the skeleton. Preserve its sections and replace its guidance comments.
5. Run `tyto-code spec lint --mode <mode> <file>`. Resolve every error and repeat until clean; ask the developer only when the correction needs their decision.
6. Show the complete draft and title to the developer and obtain confirmation before publishing.
7. Run `tyto-code spec create --mode <mode> <file> --title <confirmed-title>`. Print the returned URL. This creates the issue with its kind label and adds it to the board in Draft using the developer's `gh` authentication.
8. Offer to run `tyto-code spec ready <owner>/<repo>#<number>`. Run it only if the developer agrees; the developer controls Ready for dev.

Run commands in the developer's checkout. Set `TYTO_FACTORY` to a readable local factory.yaml or pass `--factory <path>`. No cluster access is needed. Do not switch to the factory App's credentials.
