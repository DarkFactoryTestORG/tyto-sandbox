/**
 * The dev auth bypass (PLOTLINE_DEV_AUTH=1, never in production): a request carrying this header,
 * or a cookie of the same name, is treated as the seeded user with that email.
 */
export const DEV_AUTH_HEADER = 'x-plotline-dev-user';
export const DEV_AUTH_COOKIE = DEV_AUTH_HEADER;

/** The session cookie the API sets on login. */
export const SESSION_COOKIE = 'plotline.sid';
