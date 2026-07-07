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

### Prerequisites

- Node.js 24.x or later
- npm 11.x or later
- Docker and Docker Compose
- PostgreSQL 16

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd migrant-review-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start PostgreSQL**

   ```bash
   docker compose up -d
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

5. **Run Prisma migrations**

   ```bash
   npx prisma migrate dev
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

7. **Open in browser**

   [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ADMIN_KEY` | Admin authentication key | Yes |

## Docker

### Start PostgreSQL

```bash
docker compose up -d
```

### Stop PostgreSQL

```bash
docker compose down
```

### View Logs

```bash
docker compose logs -f postgres
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
