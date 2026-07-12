#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# WorkerVoice — First-time local setup
# Run: bash setup.sh
#
# Prerequisites:
#   • Node.js 24+   (https://nodejs.org)
#   • npm 11+
#   • Docker + Docker Compose
#   • Git
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
RESET="\033[0m"

info()  { echo -e "${BOLD}${GREEN}✔${RESET} $*"; }
warn()  { echo -e "${BOLD}${YELLOW}⚠${RESET} $*"; }
fail()  { echo -e "${BOLD}${RED}✘${RESET} $*"; exit 1; }

# ── 1. Prerequisites ───────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Checking prerequisites...${RESET}"
echo ""

command -v node >/dev/null 2>&1 || fail "Node.js not found. Install Node.js 24+ from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || fail "npm not found."
command -v docker >/dev/null 2>&1 || fail "Docker not found. Install Docker from https://docker.com"

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 22 ]; then
  warn "Node.js $NODE_MAJOR detected — project uses Node 24. Some features may not work."
fi

info "Node $(node -v), npm $(npm -v), Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"
echo ""

# ── 2. Install dependencies ────────────────────────────────────────────────
echo -e "${BOLD}Installing npm dependencies...${RESET}"
npm ci
info "Dependencies installed"
echo ""

# ── 3. Environment variables ───────────────────────────────────────────────
echo -e "${BOLD}Setting up environment variables...${RESET}"

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    info "Created .env from .env.example"
  else
    cat > .env <<'ENVEOF'
# ── Local Docker dev environment ──
POSTGRES_USER=workervoice
POSTGRES_PASSWORD=workervoice_dev_pw
POSTGRES_DB=migrant_review
DATABASE_URL=postgresql://workervoice:workervoice_dev_pw@localhost:5433/migrant_review

# ── Auth ──
AUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
AUTH_URL=http://localhost:3000

# ── Email (optional — Resend) ──
RESEND_API_KEY=
EMAIL_FROM=noreply@workervoice.dev
ENVEOF
    warn "Created .env with defaults — edit with your own values if needed"
  fi
else
  info ".env already exists — skipping"
fi

# Source .env for the rest of this script
set -a
source .env
set +a
echo ""

# ── 4. Start Docker PostgreSQL ─────────────────────────────────────────────
echo -e "${BOLD}Starting PostgreSQL via Docker Compose...${RESET}"

if docker compose ps --status running 2>/dev/null | grep -q migrant-review-postgres; then
  info "PostgreSQL already running"
else
  docker compose up -d postgres
  info "PostgreSQL starting on localhost:5433"
fi

# Wait for PostgreSQL to be healthy
echo "Waiting for PostgreSQL to be ready..."
for i in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; then
    info "PostgreSQL is ready"
    break
  fi
  if [ "$i" -eq 30 ]; then
    fail "PostgreSQL did not become ready in time"
  fi
  sleep 1
done
echo ""

# ── 5. Prisma generate + migrate ───────────────────────────────────────────
echo -e "${BOLD}Running Prisma generate + migrate...${RESET}"
npx prisma generate
npx prisma migrate dev --name init 2>/dev/null || npx prisma migrate deploy
info "Database schema up to date"
echo ""

# ── 6. Seed database ───────────────────────────────────────────────────────
echo -e "${BOLD}Seeding database...${RESET}"
if [ -f prisma/seed/factories_bangkok.sql ]; then
  npx prisma db execute --file prisma/seed/factories_bangkok.sql 2>/dev/null && \
    info "Factory data seeded" || warn "Seed failed — you can run 'npm run db:seed' manually"
else
  warn "No seed file found — skipping"
fi
echo ""

# ── 7. Final output ────────────────────────────────────────────────────────
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}${GREEN}  Setup complete! 🎉${RESET}"
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo "  Start dev server:"
echo "    npm run dev"
echo ""
echo "  Open:"
echo "    http://localhost:3000"
echo ""
echo "  Useful commands:"
echo "    npm run build          — production build"
echo "    npm run test           — unit tests (vitest)"
echo "    npm run test:e2e       — e2e tests (playwright)"
echo "    npm run lint           — linter"
echo "    npm run type-check     — TypeScript check"
echo "    npx prisma studio      — database GUI"
echo ""
echo "  Cloudflare development (optional):"
echo "    cp .dev.vars.example .dev.vars   # fill in cloud DB URL"
echo "    npm run pages:dev                # wrangler dev server on :8788"
echo ""
echo "  Docker management:"
echo "    docker compose up -d              — start all containers"
echo "    docker compose down               — stop all containers"
echo "    docker compose logs -f            — follow logs"
echo ""
