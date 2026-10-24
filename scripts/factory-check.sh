#!/usr/bin/env bash
# Proves Plotline meets the factory's repo contract (.tyto/config.yaml) before the factory relies on
# it. From a clean copy of HEAD (uncommitted changes are not included), inside the toolchain image,
# with Postgres from services.postgres.image, it runs every repo-config command in order (install,
# build, migrate, seed baseline, test + JUnit check, lint, typecheck, format, reset, seed review),
# then builds both review images. It stops at the first problem.
#
#   scripts/factory-check.sh            # needs Docker
#   scripts/factory-check.sh --local    # this checkout, local tools, $DATABASE_URL (no Docker)
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ "${1:-}" == "--local" ]]; then
  cd "$here"
  exec node scripts/run-contract.mjs
fi

command -v docker >/dev/null || { echo "factory-check: docker is required (or use --local)" >&2; exit 2; }

id="plotline-check-$$"
work="$(mktemp -d)"
cleanup() {
  docker rm -f "$id-pg" >/dev/null 2>&1 || true
  docker network rm "$id" >/dev/null 2>&1 || true
  rm -rf "$work"
}
trap cleanup EXIT

echo "▶ clean copy of HEAD"
prefix="$(git -C "$here" rev-parse --show-prefix)"
mkdir -p "$work/repo"
git -C "$here" archive --format=tar "HEAD:${prefix}" | tar -x -C "$work/repo"
echo "  $(git -C "$here" rev-parse --short HEAD) → $work/repo"

echo "▶ toolchain image"
docker build -q -f "$work/repo/.tyto/toolchain.Dockerfile" -t plotline-toolchain:check "$work/repo/.tyto"

echo "▶ postgres"
pg_image="$(sed -nE "s/.*postgres: \{ *image: '?([^',]+)'?.*/\1/p" "$work/repo/.tyto/config.yaml")"
docker network create "$id" >/dev/null
docker run -d --name "$id-pg" --network "$id" \
  -e POSTGRES_USER=plotline -e POSTGRES_PASSWORD=plotline -e POSTGRES_DB=plotline "${pg_image:-postgres:17}" >/dev/null
for _ in $(seq 1 60); do
  docker exec "$id-pg" pg_isready -U plotline -d plotline >/dev/null 2>&1 && break
  sleep 1
done

echo "▶ repo-config commands, in the toolchain image"
docker run --rm --network "$id" \
  --user "$(id -u):$(id -g)" -e HOME=/tmp/home -e CI=1 \
  -e DATABASE_URL="postgres://plotline:plotline@$id-pg:5432/plotline" \
  -v "$work/repo:/workspace" -w /workspace \
  plotline-toolchain:check node scripts/run-contract.mjs

echo "▶ review images"
docker build -q -f "$work/repo/apps/api/Dockerfile" -t plotline-api:check "$work/repo"
docker build -q -f "$work/repo/apps/web/Dockerfile" -t plotline-web:check "$work/repo"

echo "✓ factory-check passed"
