One `<tag>.sql` per migration in `../`, undoing it. `pnpm --filter @plotline/db migrate:down`
runs the newest applied one's (TYTO's `migrate-roundtrip` gate: up → down → up). `0000_init` has
none: rolling back the initial schema is a reset.
