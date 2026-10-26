# Changelog

Every pull request into `dev` adds one line under **Unreleased**: what changed, for a user,
ending with the issue it closes, e.g. `- Tasks can be searched by title (#12)`. CI's
`changelog-format` check enforces the `(#n)` ending.

## Unreleased

- Clarification smoke run 202610262012 (#98)
- A conflicting entry from the smoke runner 202610261929 (#89)
- A conflicting entry from the smoke runner 202610261513 (#75)
- Factory verification excludes generated run records from formatting (#41)

- Supported ARM64 factory toolchains with verified native tool downloads (#35)

- Workspace activity API with cursor paging and a person filter (#9)
- Slack connection settings for workspace admins (#8)
- Seat billing summary for workspace admins (#7)
- Task search ignores accents and letter case (#6)
- Invite people to a workspace by email (#5)
- Project board with a task drawer and an edit-task modal (#4)
- Log in with email and password (#3)
- Workspaces, projects and tasks (#2)
- Monorepo, CI and the factory contract (#1)
