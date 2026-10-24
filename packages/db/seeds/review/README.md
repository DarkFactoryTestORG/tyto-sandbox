# The `review` seed

Every preview is reseeded with this scenario just before handoff (F20), so reviewers always see the
same world. It is `baseline` plus the accounts and data below. **Every password is `plotline`.**
These are throwaway sandbox credentials.

| Account        | Email                     | Timezone            | Roles                          |
| -------------- | ------------------------- | ------------------- | ------------------------------ |
| Olivia Owner   | owner@plotline.test       | Europe/London       | Acme owner, Harbor member      |
| Max Member     | member@plotline.test      | UTC                 | Acme member, invited to Harbor |
| Adele Admin    | adele@plotline.test       | Europe/Berlin       | Acme admin                     |
| Victor Viewer  | victor@plotline.test      | UTC                 | Acme viewer                    |
| Nora Newyork   | nora@plotline.test        | America/New_York    | Acme member                    |
| Luis Angeles   | luis@plotline.test        | America/Los_Angeles | Acme member, Harbor viewer     |
| Kenji Tokyo    | kenji@plotline.test       | Asia/Tokyo          | Harbor owner                   |
| Aroha Auckland | aroha@plotline.test       | Pacific/Auckland    | Harbor admin                   |
| Oscar Other    | other-owner@plotline.test | UTC                 | Other Co owner                 |

What is there:

- **Acme** (monthly plan): projects _Alpha_ and _Website relaunch_, overdue, due-today, upcoming and
  undated tasks, labels, comments and an activity history. Pending invites for
  `pat@plotline.test` (member) and `quinn@plotline.test` (viewer).
- **Harbor Labs** (annual plan): project _Research_, with members in Tokyo and Auckland.
- **Other Co**: a workspace none of the Acme accounts can see.

Dates are relative to the seed's "now" (`--now`, else `PLOTLINE_SEED_NOW`, else 2026-10-01T09:00:00Z),
so the same "now" always gives the same database.
