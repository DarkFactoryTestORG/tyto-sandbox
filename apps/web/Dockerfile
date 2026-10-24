# syntax=docker/dockerfile:1
# Plotline web review image (repo config apps.web): Next.js standalone output. Build from the repo
# root:
#   docker build -f apps/web/Dockerfile -t plotline-web .
# Runs as non-root; writes only to /tmp. Configured only by env: API_URL (read per request by the
# /api proxy, so the image is the same in every environment) and PORT (3000).
ARG NODE_IMAGE=node:22.22.0-bookworm-slim
ARG TURBO_VERSION=2.11.10

FROM ${NODE_IMAGE} AS base
RUN corepack enable

FROM base AS prune
ARG TURBO_VERSION
WORKDIR /repo
COPY . .
RUN npx -y "turbo@${TURBO_VERSION}" prune @plotline/web --docker

FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
WORKDIR /repo
COPY --from=prune /repo/out/json/ ./
RUN pnpm install --frozen-lockfile
COPY --from=prune /repo/out/full/ ./
COPY tsconfig.base.json ./
RUN pnpm turbo run build --filter=@plotline/web...

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
