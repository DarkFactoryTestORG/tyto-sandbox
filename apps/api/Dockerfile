# syntax=docker/dockerfile:1
# Plotline API review image (repo config apps.api). Build from the repo root:
#   docker build -f apps/api/Dockerfile -t plotline-api .
# Runs as non-root with a read-only root filesystem (it writes nothing). Configured only by env:
# DATABASE_URL, PORT (4000), SESSION_SECRET, PLOTLINE_SECRET_KEY, PLOTLINE_FLAGS, PLOTLINE_DEV_AUTH
# (refused under NODE_ENV=production; previews set NODE_ENV=preview), PLOTLINE_MIGRATE_ON_START=1.
ARG NODE_IMAGE=node:22.22.0-bookworm-slim
ARG RUST_IMAGE=rust:1.97.0-bookworm
ARG TURBO_VERSION=2.11.10

FROM ${NODE_IMAGE} AS node

# Only the api and the workspace packages it depends on (turbo prune --docker).
FROM node AS prune
ARG TURBO_VERSION
WORKDIR /repo
COPY . .
RUN npx -y "turbo@${TURBO_VERSION}" prune @plotline/api --docker

# The api depends on the textkit napi addon, so the build stage needs Rust and Node.
FROM ${RUST_IMAGE} AS build
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s ../lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack \
 && ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
 && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
 && corepack enable
WORKDIR /repo
COPY --from=prune /repo/out/json/ ./
RUN pnpm install --frozen-lockfile
COPY --from=prune /repo/out/full/ ./
COPY tsconfig.base.json Cargo.toml Cargo.lock rust-toolchain.toml ./
RUN pnpm turbo run build --filter=@plotline/api... \
 && pnpm --filter @plotline/api deploy --legacy --prod /out/api

FROM node AS runtime
ENV NODE_ENV=production \
    PORT=4000
WORKDIR /app
COPY --from=build /out/api ./
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
