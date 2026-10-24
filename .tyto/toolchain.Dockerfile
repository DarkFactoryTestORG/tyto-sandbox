# Plotline's toolchain: the image the factory's base image is built on (phase 08). Tools only, no
# app code. Every version is pinned, so the image builds the same way every time.
#   docker build -f .tyto/toolchain.Dockerfile -t plotline-toolchain .tyto
FROM node:22.22.0-bookworm

ARG TARGETARCH
ARG PNPM_VERSION=10.28.0
ARG RUST_VERSION=1.97.0
ARG NAPI_CLI_VERSION=2.18.4
# Must match @playwright/test in apps/web/package.json (and so the lockfile).
ARG PLAYWRIGHT_VERSION=1.56.1
ARG NEXTEST_VERSION=0.9.120
ARG SCCACHE_VERSION=0.10.0
ARG POSTGRES_MAJOR=17

ENV CARGO_HOME=/usr/local/cargo \
    RUSTUP_HOME=/usr/local/rustup \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PNPM_HOME=/usr/local/pnpm \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1
ENV PATH=/usr/local/cargo/bin:/usr/local/pnpm:$PATH

# Postgres client tools matching the server (services.postgres.image), from the PGDG repository.
RUN set -eux; \
    install -d /usr/share/postgresql-common/pgdg; \
    curl -fsSL -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc; \
    echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends git bash ca-certificates "postgresql-client-${POSTGRES_MAJOR}"; \
    rm -rf /var/lib/apt/lists/*

# Rust, pinned, with clippy and rustfmt; nextest for JUnit; sccache for phase 08's buildCache.
RUN set -eux; \
    case "${TARGETARCH}" in \
      amd64) rust_arch=x86_64 ;; \
      arm64) rust_arch=aarch64 ;; \
      *) echo "Unsupported architecture: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl -fsSL https://sh.rustup.rs | sh -s -- -y --no-modify-path --profile minimal \
      --default-toolchain "${RUST_VERSION}" --component clippy,rustfmt; \
    nextest="cargo-nextest-${NEXTEST_VERSION}-${rust_arch}-unknown-linux-gnu"; \
    sccache="sccache-v${SCCACHE_VERSION}-${rust_arch}-unknown-linux-musl"; \
    cd /tmp; \
    curl -fsSL -o "${nextest}.tar.gz" "https://github.com/nextest-rs/nextest/releases/download/cargo-nextest-${NEXTEST_VERSION}/${nextest}.tar.gz"; \
    curl -fsSL -o nextest.sha256 "https://github.com/nextest-rs/nextest/releases/download/cargo-nextest-${NEXTEST_VERSION}/${nextest}.sha256"; \
    echo "$(awk '{print $1}' nextest.sha256)  ${nextest}.tar.gz" | sha256sum -c -; \
    tar -xzf "${nextest}.tar.gz" -C "${CARGO_HOME}/bin"; \
    curl -fsSL -o "${sccache}.tar.gz" "https://github.com/mozilla/sccache/releases/download/v${SCCACHE_VERSION}/${sccache}.tar.gz"; \
    curl -fsSL -o sccache.sha256 "https://github.com/mozilla/sccache/releases/download/v${SCCACHE_VERSION}/${sccache}.tar.gz.sha256"; \
    echo "$(awk '{print $1}' sccache.sha256)  ${sccache}.tar.gz" | sha256sum -c -; \
    tar -xzf "${sccache}.tar.gz" --strip-components=1 -C /usr/local/bin "${sccache}/sccache"; \
    rm "${nextest}.tar.gz" "${sccache}.tar.gz" nextest.sha256 sccache.sha256; \
    chmod -R a+rwX "${CARGO_HOME}" "${RUSTUP_HOME}"

# pnpm through corepack; the napi CLI; Playwright's Chromium and its OS dependencies.
RUN set -eux; \
    corepack enable; \
    corepack prepare "pnpm@${PNPM_VERSION}" --activate; \
    npm install -g "@napi-rs/cli@${NAPI_CLI_VERSION}"; \
    npx -y "playwright@${PLAYWRIGHT_VERSION}" install --with-deps chromium; \
    chmod -R a+rX "${PLAYWRIGHT_BROWSERS_PATH}"; \
    mkdir -p "${PNPM_HOME}" && chown 1000:1000 "${PNPM_HOME}"; \
    rm -rf /var/lib/apt/lists/* /root/.npm

# The node image's `node` user is 1000:1000.
USER 1000:1000
ENV HOME=/home/node
WORKDIR /workspace
