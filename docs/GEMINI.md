# Migrant Review Platform — Developer Documentation

> **Developer & AI Agent Documentation**
>
> This document provides a comprehensive overview of the **Migrant Review Platform**, its architecture, database schema, API design, and development guide.

---

## 📌 Project Overview

**Migrant Review Platform** is a web platform designed to help migrant workers (specifically in Thailand 🇹🇭 and Malaysia 🇲🇾) find safe, verified workplaces and share reviews about factories and employment agencies.

The codebase features a Next.js 14 App Router backend with TypeScript, a PostgreSQL database with Prisma ORM, and a React frontend with Tailwind CSS.

---

## 📁 Directory Structure

```text
migrant-review-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── factories/            # Factory endpoints
│   │   ├── provinces/            # Province/district endpoints
│   │   ├── regions/              # Region endpoints
│   │   ├── suggestions/          # Suggestion submission
│   │   ├── organizations/        # Organization search
│   │   └── admin/                # Admin endpoints
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/                          # Shared utilities
│   ├── prisma.ts                 # Prisma client singleton
│   ├── factories.ts              # Factory database helpers
│   ├── reviews.ts                # Review database helpers
│   ├── suggestions.ts            # Suggestion database helpers
│   ├── admin.ts                  # Admin authentication
│   └── index.ts                  # Re-exports
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── scripts/                      # Data import scripts
│   ├── download_diw_factories.py # Download DIW Excel files
│   ├── import_factories.py       # Import Excel to PostgreSQL
│   └── requirements.txt          # Python dependencies
├── docker-compose.yml            # PostgreSQL container
├── province_districts.json       # Thai province/district mapping
├── package.json                  # Node.js dependencies
└── .env                          # Environment variables
```

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Frontend: React + Tailwind]
    Server[Backend: Next.js 14 App Router]
    DB[(Database: PostgreSQL 16)]
    Prisma[ORM: Prisma 5]

    Client -- "API Requests" --> Server
    Server -- "Prisma Client" --> Prisma
    Prisma -- "SQL Queries" --> DB
    Server -- "JSON Responses" --> Client
```

---

## 🗄️ Database Schema

The database uses **PostgreSQL 16** with **Prisma ORM**. Schema defined in `prisma/schema.prisma`.

### Enums

| Enum               | Values                              | Description         |
| ------------------ | ----------------------------------- | ------------------- |
| `OrganizationType` | `factory`, `agency`                 | Type of organization |
| `SuggestionStatus` | `pending`, `approved`, `rejected`   | Approval status      |

### Tables

#### `factories`

DIW-imported Thai factory data (auto-approved).

| Column | Type | Description |
|--------|------|-------------|
| `id` | `SERIAL` | Primary key |
| `reg_number` | `VARCHAR(50)` | Unique registration number |
| `name` | `VARCHAR(500)` | Factory name |
| `operator` | `VARCHAR(500)` | Operator name |
| `business_activity` | `TEXT` | Business description |
| `house_number` | `VARCHAR(100)` | Address components |
| `village` | `VARCHAR(100)` | |
| `soi` | `VARCHAR(200)` | |
| `road` | `VARCHAR(200)` | |
| `subdistrict` | `VARCHAR(200)` | |
| `district` | `VARCHAR(200)` | |
| `province` | `VARCHAR(200)` | |
| `postal_code` | `VARCHAR(10)` | |
| `phone` | `VARCHAR(50)` | |
| `type` | `VARCHAR(100)` | Factory type |
| `capital_baht` | `DECIMAL` | Capital in Baht |
| `workers` | `INTEGER` | Number of workers |
| `horsepower` | `DECIMAL` | Machinery horsepower |
| `tsic` | `VARCHAR(50)` | Thai Standard Industrial Classification |
| `country` | `VARCHAR(100)` | Default: 'Thailand' |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |

**Indexes:** `name`, `province`, `district`, `reg_number` (unique)

#### `suggested_organizations`
User-submitted factories/agencies pending admin approval.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `SERIAL` | Primary key |
| `name` | `VARCHAR(255)` | Organization name |
| `type` | `OrganizationType` | factory or agency |
| `country` | `VARCHAR(255)` | Target country |
| `city` | `VARCHAR(255)` | City/province (optional) |
| `status` | `SuggestionStatus` | Default: pending |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | Last update timestamp |

#### `reviews`
Worker reviews linked to either factories OR organizations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `SERIAL` | Primary key |
| `organization_id` | `INT` | FK to suggested_organizations (nullable) |
| `factory_id` | `INT` | FK to factories (nullable) |
| `worker_role` | `VARCHAR(255)` | Worker's job role |
| `country_from` | `VARCHAR(100)` | Worker's home country |
| `rating_salary` | `INTEGER` | 1-5 rating |
| `rating_ot` | `INTEGER` | 1-5 rating (overtime) |
| `rating_housing` | `INTEGER` | 1-5 rating |
| `review_text` | `TEXT` | Review content |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |

**Constraint:** Must link to exactly one of `organization_id` or `factory_id`.

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000`

### Factory Endpoints

#### Search Factories

* **Route:** `GET /api/factories`
* **Query Parameters:**
  * `search` (Optional): Search by name/operator
  * `province` (Optional): Filter by province
  * `district` (Optional): Filter by district
  * `region` (Optional): Filter by region (Bangkok_and_Central, Northern, Northeastern, Eastern, Western, Southern)
  * `workers_min` (Optional): Minimum workers
  * `workers_max` (Optional): Maximum workers
  * `sort` (Optional): `name_asc`, `name_desc`, `workers_asc`, `workers_desc`, `newest`
  * `limit` (Optional): Results per page (default: 20)
  * `offset` (Optional): Pagination offset (default: 0)
* **Response:**
  ```json
  {
    "data": [...],
    "total": 150,
    "limit": 20,
    "offset": 0
  }
  ```

#### Get Factory Detail
* **Route:** `GET /api/factories/:id`
* **Response:**
  ```json
  {
    "data": {
      "id": 1,
      "reg_number": "12345",
      "name": "Factory Name",
      ...
    }
  }
  ```

#### Get Factory Reviews
* **Route:** `GET /api/factories/:id/reviews`
* **Response:**
  ```json
  {
    "data": [...],
    "stats": {
      "count": 10,
      "avgSalary": 4.2,
      "avgOt": 3.8,
      "avgHousing": 4.0,
      "avgOverall": 4.0
    }
  }
  ```

#### Submit Review
* **Route:** `POST /api/factories/:id/reviews`
* **Request Body:**
  ```json
  {
    "worker_role": "Machine Operator",
    "country_from": "Myanmar",
    "rating_salary": 4,
    "rating_ot": 3,
    "rating_housing": 5,
    "review_text": "Good workplace with fair wages..."
  }
  ```
* **Response (201):**
  ```json
  {
    "message": "Review submitted",
    "data": {
      "id": 1,
      "createdAt": "2026-07-06T..."
    }
  }
  ```

### Location Endpoints

#### List Provinces
* **Route:** `GET /api/provinces`
* **Response:**
  ```json
  {
    "data": ["Bangkok", "Chiang Mai", "Nakhon Ratchasima", ...]
  }
  ```

#### Get Districts
* **Route:** `GET /api/provinces/:province/districts`
* **Response:**
  ```json
  {
    "data": ["District1", "District2", ...]
  }
  ```

#### List Regions
* **Route:** `GET /api/regions`
* **Response:**
  ```json
  {
    "data": [
      { "id": "Bangkok_and_Central", "name": "Bangkok & Central" },
      { "id": "Northern", "name": "Northern" },
      ...
    ]
  }
  ```

### Suggestion Endpoints

#### Submit Suggestion
* **Route:** `POST /api/suggestions`
* **Request Body:**
  ```json
  {
    "name": "New Factory",
    "type": "factory",
    "country": "Thailand",
    "city": "Bangkok"
  }
  ```
* **Response (201):**
  ```json
  {
    "message": "Suggestion submitted",
    "data": {
      "id": 1,
      "status": "pending"
    }
  }
  ```

#### Search Organizations
* **Route:** `GET /api/organizations`
* **Query Parameters:**
  * `search` (Optional): Search by name
  * `country` (Optional): Filter by country
* **Response:**
  ```json
  {
    "data": [...]
  }
  ```

### Admin Endpoints

All admin endpoints require header: `x-admin-key: <ADMIN_KEY>`

#### Get Suggestions
* **Route:** `GET /api/admin/suggestions`
* **Query Parameters:**
  * `status` (Optional): `pending`, `approved`, `rejected`
* **Response:**
  ```json
  {
    "data": [...]
  }
  ```

#### Update Suggestion Status
* **Route:** `PUT /api/admin/suggestions/:id/status`
* **Request Body:**
  ```json
  {
    "status": "approved"
  }
  ```
* **Response:**
  ```json
  {
    "message": "Status updated",
    "data": {
      "id": 1,
      "status": "approved"
    }
  }
  ```

---

## 🚀 Setup & Local Development

### Prerequisites

* **Node.js** v18+
* **Docker** (for PostgreSQL)
* **Python 3.8+** (for data import scripts)

### 1. Start Database

```bash
docker compose up -d
```

This starts PostgreSQL 16 on port 5432 with:
- Database: `migrant_review_db`
- User: `migrant_user`
- Password: `your-database-password`

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```env
DATABASE_URL="postgresql://migrant_user:your-database-password@localhost:5432/migrant_review_db?schema=public"
ADMIN_KEY="your_secure_admin_key_here"
```

### 4. Run Migrations

```bash
npx prisma migrate dev
```

### 5. Import Factory Data (Optional)

```bash
# Install Python dependencies
pip install -r scripts/requirements.txt
playwright install chromium

# Download DIW factory data (~10-15 minutes)
python scripts/download_diw_factories.py

# Import to database
python scripts/import_factories.py
```

### 6. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma studio` | Open Prisma Studio (database GUI) |

---

## 🗺️ Roadmap

### Completed ✅
- [x] Database schema (Prisma)
- [x] Database migrations
- [x] API endpoints (factories, reviews, suggestions, admin)
- [x] TypeScript types
- [x] Build passing

### Next Steps 🚧
- [ ] **Home Page** - Search interface with factory/agency listings
- [ ] **Factory List Page** - Filterable list with search
- [ ] **Factory Detail Page** - Information + reviews
- [ ] **Review Submission Form** - Anonymous review with ratings
- [ ] **Agency Pages** - List and detail for agencies
- [ ] **Voting System** - Useful/Not useful on reviews
- [ ] **Admin Dashboard** - Manage suggestions and reviews
- [ ] **Data Import** - DIW factory data integration
- [ ] **Deployment** - Vercel + Supabase

---

## 🔧 Development Rules

1. **TypeScript only** — No JavaScript files
2. **Server components by default** — Use `'use client'` only for forms/interactions
3. **Run `npm run lint`** before committing
4. **Small, focused features** — Don't build everything at once
5. **Create migrations** for schema changes

---

## 📝 Notes

### Thai/English Mapping
The `province_districts.json` file contains Thai province/district mappings used for search and display. The `lib/factories.ts` file contains the `PROVINCE_REGION` mapping for region-based filtering.

### Admin Authentication
Admin endpoints use `x-admin-key` header. The key must match the `ADMIN_KEY` environment variable.

### Review Constraints
Reviews must link to exactly one entity (factory OR organization). The database enforces this with a check constraint.
