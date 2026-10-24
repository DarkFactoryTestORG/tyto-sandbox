# Planted bugs

Plotline is the factory's sandbox. These bugs are planted on purpose so that the issue
catalogue's bug examples are real; the factory has to find their causes itself. This list is for
the humans who run the sandbox. It is not in `.tyto/`, and it must never be copied into an issue,
a prompt or a standard. **Don't fix these** outside the factory, and don't add tests that assert
the correct behaviour: the factory's regression tests do that.

| Issue | Bug                                                           | Cause                                                                                                                                                                                                                                                                                                                                      | Reproduce                                                                                                    |
| ----- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| #101  | A due date set by a user west of UTC reads back a day early   | `parseDueDate` (`apps/api/src/tasks/dates.ts:41`) takes the date at UTC midnight, then adds the user's UTC offset, which moves it into the previous day for negative offsets. `formatDueDate` returns the UTC date.                                                                                                                        | Set your profile timezone to America/New_York, edit a task's due date to 3 Nov 2026, reload: it shows 2 Nov. |
| #102  | On phones the assignee list in the edit-task modal is cut off | `Modal` becomes a bottom sheet with `overflow: hidden` at ≤600px (`packages/ui-kit/src/Modal.module.css`), and `AssigneePicker`'s list is absolutely positioned below its button with no flip (`apps/web/src/components/AssigneePicker.module.css`). The picker is the modal's last field, so the list overflows the sheet and is clipped. | 375×812 viewport, open a task, Edit, Assignee. Worse in a workspace with many members.                       |
| #103  | Double-accepting an invite creates two memberships            | No unique index on `memberships (workspace_id, user_id)`; `InvitesService.accept` reads, then inserts (a race), and the Accept button is not disabled while the request runs. `BillingService.seatCount` counts rows, so the duplicate is billed.                                                                                          | Fire two `POST /invites/:id/accept` at once for the same user (or double-click Accept): two rows.            |

## Deliberate weaknesses (not bugs)

These make the maintenance examples real. They behave correctly; they are just worse than they
should be.

| Issue | Weakness                                                                        | Where                                                                              |
| ----- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| #109  | Role checks copied into every project and task handler, with small differences  | `apps/api/src/projects/projects.service.ts`, `apps/api/src/tasks/tasks.service.ts` |
| #110  | No index on `tasks.project_id`; OFFSET paging; labels loaded one task at a time | `TasksService.list`                                                                |
| #111  | ui-kit 3.8's Modal has no focus trap                                            | `packages/ui-kit/src/Modal.tsx`                                                    |
| #112  | Seat proration is tested for additions only                                     | `apps/api/src/billing/proration.test.ts`                                           |
