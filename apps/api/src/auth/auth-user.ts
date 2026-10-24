import type { User } from '@plotline/shared';

/** What Passport puts on req.user: the logged-in user, as the API returns it. */
export type AuthUser = User;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends AuthUser {}
  }
}
