# Design standard

## Components

- Use `@plotline/ui-kit` first: `Button` (`kind`: primary, secondary, danger, ghost), `Modal`,
  `useToast`, `Spinner`, and the theme tokens (`color`, `space`, `radius`; CSS custom properties
  such as `var(--color-primary)`). Don't hard-code colours or spacing that a token covers.
- App components live in `apps/web/src/components/`, one component per file, with a CSS module
  next to it (`Thing.tsx` + `Thing.module.css`). Plain CSS modules; no CSS-in-JS, no utility
  frameworks.
- Forms use `components/forms.module.css` (`form`, `field`, `row`, `error`). Show server field
  errors (422 `errors`) inline under the field and mark the input `aria-invalid`.

## Standard UI states

Every screen that loads data handles all four, using `components/StateViews.tsx`:

| State                 | Component                        | Notes                                              |
| --------------------- | -------------------------------- | -------------------------------------------------- |
| loading               | `<Loading label="…" />`          | A labelled progress indicator                      |
| empty                 | `<EmptyState title="…" />`       | Say what's missing and, if possible, how to add it |
| error                 | `<ErrorState message onRetry />` | An alert with a retry                              |
| not found / no access | `<NotFound />`                   | The same page for both, so access isn't leaked     |

Viewers (`role: viewer`) see the same screens with every control that changes data hidden;
`useWorkspace().canEdit` tells you which.

## Viewports

Two standard viewports, used by e2e tests and evidence screenshots:

- **phone**: 375×812
- **desktop**: 1440×900

Layouts must work at both. On phones the sidebar becomes a top bar, the board is one column, and
`Modal` becomes a bottom sheet.

## Accessibility basics

- Every control has an accessible name (a `<label>`, or `aria-label` for icon buttons).
- Use real elements: `<button>` for actions, `<a>`/`<Link>` for navigation, lists for lists.
- Dialogs have `role="dialog"` and a name; Escape closes them.
- Keyboard: everything reachable with Tab; pickers support arrow keys, Enter and Escape.
- Don't convey meaning by colour alone (labels have text; status has words).
