# ---------------------------------------------------------------------------
# hemmiles-mcp-server — TypeScript MCP server for the public Hemmiles website.
#
# Multi-stage. The final image runs the compiled server as a non-root user,
# over the Streamable HTTP transport bound to 0.0.0.0:3001, and contains no
# dev dependencies and no build toolchain (no TypeScript, no tests).
#
# The only network the build needs is the npm registry in the dependency
# stages. The server itself reaches out only to https://hemmiles.com at run
# time (read-only); it holds no secrets, so there are no build-time secrets.
# ---------------------------------------------------------------------------

# ---- Stage 1: install ALL dependencies (needed to compile) ----------------
FROM node:22-alpine AS deps
WORKDIR /app

# libc6-compat: some npm postinstall binaries expect glibc symbols on musl.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# ---- Stage 2: build (tsc -> dist/) ----------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

# ---- Stage 3: production-only dependencies --------------------------------
# A separate stage so the runtime node_modules excludes TypeScript, tsx, types,
# etc. Keeps the final image small and free of the build toolchain.
FROM node:22-alpine AS prod-deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- Stage 4: runtime ------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Transport & server config. All are runtime env vars (nothing is inlined at
# build time), so they can be overridden with `docker run -e ...`.
#   HEMMILES_TRANSPORT       http | stdio. In a container, http is the useful
#                            default; override to stdio only when attaching a
#                            client over the process's stdio.
#   PORT                     HTTP listen port (ignored for stdio).
#   HEMMILES_DEFAULT_LOCALE  market used when a tool omits one.
# See .env.example for the full list (timeouts, retries, rate limit, cache, UA).
ENV HEMMILES_TRANSPORT=http
ENV PORT=3001
ENV HEMMILES_DEFAULT_LOCALE=in
# Bind on every interface (read by the server as the listen address).
# The /mcp Host allowlist defaults to loopback + mcp.hemmiles.com; set
# MCP_ALLOWED_HOSTS if the proxy forwards a different Host header.
ENV HOST=0.0.0.0

# Run as an unprivileged user.
RUN addgroup -g 1001 -S nodejs \
 && adduser -S mcp -u 1001

COPY --from=prod-deps --chown=mcp:nodejs /app/node_modules ./node_modules
COPY --from=builder  --chown=mcp:nodejs /app/dist ./dist
COPY --chown=mcp:nodejs package.json ./

USER mcp

EXPOSE 3001

# Container-level health signal: the HTTP transport serves GET /health.
# (For stdio mode there is no HTTP endpoint; disable or override this check.)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
