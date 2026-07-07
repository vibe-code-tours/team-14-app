# WorkerVoice — Migrant Review Platform

A workplace review platform that helps Myanmar migrant workers make safer employment decisions before joining a company or recruitment agency.

## Features

- **Company Search** — Search factories and agencies by location, size, and activity
- **Company Detail** — View detailed information about factories and agencies
- **Anonymous Reviews** — Submit anonymous workplace reviews
- **Useful / Not Useful Voting** — Vote on review helpfulness
- **Agency Detail** — View recruitment agency information
- **Telegram Bot Integration** — Search via Telegram bot

## Technology Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 24.16.x | Runtime |
| Next.js | 16.2.x | Web framework |
| React | 19.2.x | UI library |
| TypeScript | 5.9.x | Type safety |
| Prisma | 7.8.x | ORM |
| Tailwind CSS | 4.3.x | Styling |
| ESLint | 9.x | Linting |
| PostgreSQL | 16 | Database |

## Folder Structure

```
migrant-review-platform/
├── app/                    # Next.js App Router
│   ├── api/               # Route handlers
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # Reusable UI components
│   ├── types/             # TypeScript type definitions
│   └── generated/         # Prisma generated client
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── factories.ts       # Factory service
│   ├── reviews.ts         # Review service
│   ├── suggestions.ts     # Suggestion service
│   └── admin.ts           # Admin authentication
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── docs/                  # Documentation
└── public/                # Static assets
```

## Local Development

You can run the app either **fully in Docker** (recommended — no local Node.js setup required) or **on your host** with only PostgreSQL in Docker.

### Option A: Run everything with Docker Desktop (recommended)

Use this if you don't want to install Node.js, npm, or PostgreSQL locally — Docker Desktop is the only requirement. It builds the app image and runs the database, migrations, and Next.js dev server as three containers that talk to each other over an internal Docker network.

#### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and **running** (check the whale icon in your system tray/menu bar)

#### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd migrant-review-platform
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   `.env` holds the PostgreSQL credentials and connection string used by the containers. Edit it if you want different local credentials — the defaults work out of the box and are for local development only, never for staging/production.

3. **Start the stack**

   ```bash
   docker compose up -d
   ```

   `-d` runs containers in the background ("detached"). The first run will take a minute or two while Docker pulls the `postgres:16` image and builds the app image from the `Dockerfile`. This command starts three containers, in dependency order:

   | Container | Image/Build | Role |
   |-----------|--------------|------|
   | `migrant-review-postgres` | `postgres:16` | Database. Compose waits until its healthcheck (`pg_isready`) passes before starting `migrate`. |
   | `migrant-review-migrate` | built from `Dockerfile` | Runs `npx prisma migrate dev --name auto` once against `postgres`, applies any pending schema migrations, then exits (exit code 0 is expected — it's a one-shot job, not a long-running service). |
   | `migrant-review-app` | built from `Dockerfile` | Runs `npm run dev` (Next.js + Turbopack). Starts only after `migrate` exits successfully. Your project folder is bind-mounted into the container so edits on your host are reflected live. |

4. **Verify it's running**

   ```bash
   docker compose ps
   ```

   You should see `postgres` and `app` with status `Up` (or `Up (healthy)` for postgres), and `migrate` with status `Exited (0)` — that's correct, not a failure.

   Then confirm the app responds:

   ```bash
   curl -I http://localhost:3000
   ```

   Expect `HTTP/1.1 200 OK`. Or just open it in a browser.

5. **Open in browser**

   [http://localhost:3000](http://localhost:3000)

6. **Follow logs (optional)**

   ```bash
   docker compose logs -f app
   ```

   Look for `✓ Ready in <ms>` — that confirms the Next.js dev server booted. Press `Ctrl+C` to stop following (this does not stop the container).

7. **Stop the stack**

   ```bash
   docker compose down
   ```

   This stops and removes the containers but keeps the database volume (your data persists). Add `-v` to also delete the volume and start fresh next time (`docker compose down -v`).

**Editing code:** changes under `app/`, `src/`, `lib/`, or `prisma/` on your host reload automatically inside the container — no rebuild needed for source changes. Only rebuild (`docker compose up -d --build`) when you change `package.json`, the `Dockerfile`, or `docker-compose.yml`.

**Running Prisma commands from the host:** since `postgres` also publishes port `5432` to `localhost`, you can run `npx prisma studio`, `npx prisma migrate status`, etc. directly from your host machine (no Node.js install on the container needed) as long as your host `.env` has a matching `DATABASE_URL` pointing at `localhost:5432`.

### Option B: Run Next.js on host, PostgreSQL in Docker

Use this if you already have Node.js installed and prefer running the dev server directly on your machine (e.g. for using host-native debuggers, or if the polling-based file watching in Option A feels slower than native). Docker is only used for the database here.

#### Prerequisites

- Node.js 24.x or later (`node -v` to check)
- npm 11.x or later (`npm -v` to check)
- Docker Desktop installed and running (for PostgreSQL only)

#### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd migrant-review-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This also runs the `prepare` script (Husky), which sets up git hooks for linting.

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Here `DATABASE_URL` must point at `localhost:5432` (not `postgres:5432` — that hostname only resolves inside the Docker network), which is already the default in `.env.example`.

4. **Start PostgreSQL only**

   ```bash
   docker compose up -d postgres
   ```

   This intentionally skips the `migrate` and `app` containers (Compose won't start services that aren't explicitly named unless another running service depends on them). Only the database container starts.

5. **Verify PostgreSQL is healthy**

   ```bash
   docker compose ps postgres
   ```

   Status should show `Up (healthy)`. If it says `starting`, wait a few seconds and check again.

6. **Generate the Prisma client**

   ```bash
   npx prisma generate
   ```

   Regenerates `src/generated/prisma` from `prisma/schema.prisma`. Required after a fresh clone/install, and any time the schema changes.

7. **Run Prisma migrations**

   ```bash
   npx prisma migrate dev
   ```

   Applies all pending migrations from `prisma/migrations/` to your local database. If the schema hasn't changed since the last migration, it reports "Already in sync" and exits.

8. **Start development server**

   ```bash
   npm run dev
   ```

   Wait for `✓ Ready in <ms>` in the terminal.

9. **Verify it's running**

   In a separate terminal:

   ```bash
   curl -I http://localhost:3000
   ```

   Expect `HTTP/1.1 200 OK`.

10. **Open in browser**

    [http://localhost:3000](http://localhost:3000)

**Stopping:** `Ctrl+C` stops the dev server. `docker compose stop postgres` stops the database container without removing it; `docker compose down` removes it (data persists in the volume unless you add `-v`).

### Troubleshooting

**`docker compose up` fails with "port is already allocated" (3000 or 5432)**

Another process is already using that port.

```bash
# Windows PowerShell — find what's using port 3000 or 5432
Get-NetTCPConnection -LocalPort 3000
Get-NetTCPConnection -LocalPort 5432
```

Stop the conflicting process, or change the host-side port in `docker-compose.yml` (e.g. `"3001:3000"`) or in your host `npm run dev` setup.

**`migrate` container exits with an error instead of `Exited (0)`**

```bash
docker compose logs migrate
```

Common causes: `postgres` wasn't actually healthy yet (rare — Compose should wait), or `prisma/schema.prisma` has an invalid change. Fix the schema/migration issue, then retry with:

```bash
docker compose up -d migrate
```

**App container keeps restarting or shows connection errors to the database**

```bash
docker compose logs app
docker compose ps
```

Confirm `postgres` shows `Up (healthy)`. If it's still starting, `app` may briefly fail to connect on the first attempt — the `restart: unless-stopped` policy retries automatically. If it doesn't recover after ~30s, check that `DATABASE_URL` in `docker-compose.yml` uses the hostname `postgres` (the Docker service name), not `localhost`.

**Editing code doesn't trigger a reload (Option A)**

1. Confirm the container sees your file: `docker exec migrant-review-app cat /app/app/page.tsx` (or the file you edited) and check it matches what's on disk.
2. If the file is correct but the browser is stale, restart the app container: `docker compose restart app`.
3. `WATCHPACK_POLLING`/`CHOKIDAR_USEPOLLING` are already enabled in `docker-compose.yml` to work around Docker Desktop's bind-mount file-watching limitations on Windows/macOS — don't remove them.

**`npx prisma migrate dev` fails with "Can't reach database server" (Option B)**

- Check `docker compose ps postgres` shows `Up (healthy)`.
- Check `.env`'s `DATABASE_URL` uses `localhost:5432`, not `postgres:5432`.
- Check nothing else on your machine (a native PostgreSQL install, another project's container) is already bound to port 5432.

**Need a completely clean slate**

```bash
docker compose down -v
docker compose up -d --build
```

This removes the database volume (all local data is lost) and rebuilds images from scratch.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed.

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_USER` | PostgreSQL username (used by the `postgres` container) | Yes |
| `POSTGRES_PASSWORD` | PostgreSQL password (used by the `postgres` container) | Yes |
| `POSTGRES_DB` | PostgreSQL database name (used by the `postgres` container) | Yes |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma on the host | Yes |
| `NEXT_PUBLIC_API_URL` | Base URL the frontend uses to call the API | Yes |
| `ADMIN_KEY` | Admin authentication key | Yes |

Never commit `.env` — it's git-ignored. Only `.env.example` (with placeholder values) is committed.

## Docker

### Start the full stack (Postgres + migrations + app)

```bash
docker compose up -d
```

### Start PostgreSQL only

```bash
docker compose up -d postgres
```

### Rebuild after dependency or Dockerfile changes

```bash
docker compose up -d --build
```

### Stop everything

```bash
docker compose down
```

### View logs

```bash
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f migrate
```

## Prisma

### Generate Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev
```

### Check Migration Status

```bash
npx prisma migrate status
```

### Open Prisma Studio

```bash
npx prisma studio
```

## Testing

### Unit Tests

```bash
npm run test
npm run test:run
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

1. Build Docker image
2. Configure environment variables
3. Run with Docker Compose

## Roadmap

### Sprint 1

- [ ] Add security headers
- [ ] Add input validation
- [ ] Add test suite
- [ ] Set up CI/CD

### Sprint 2

- [ ] User authentication
- [ ] Review moderation
- [ ] Admin dashboard

### Future

- [ ] Telegram bot integration
- [ ] Multi-country support
- [ ] Mobile application

## Documentation

- [Architecture](docs/architecture/system-architecture.md)
- [API Specification](docs/architecture/api-specification.md)
- [Database Design](docs/architecture/database-design.md)
- [Security](docs/operations/security.md)
- [Deployment](docs/operations/deployment.md)

## License

MIT License

---

**Project Status:** Ready for Sprint 1 development.
