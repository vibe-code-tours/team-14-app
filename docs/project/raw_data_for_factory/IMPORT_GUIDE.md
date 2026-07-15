# Factory Data Import Guide

## What Was Done

### 1. Schema Change

Added `oldRegNumber` field to the `Factory` model to store the original Thai factory registration number (เลขทะเบียนเดิม).

**File:** `prisma/schema.prisma`

```prisma
oldRegNumber     String?  @map("old_reg_number") @db.VarChar(50)
```

**Migration:** `prisma/migrations/20260707171848_add_factory_old_reg_number/`

### 2. Import Script Updated

**File:** `scripts/import_factories.py`

Changes:
- Added Thai header translation (`THAI_HEADER_MAP`) so the script reads XLS files with Thai column names
- Added `old_reg_number` to the import (was previously skipped)
- Now scans both `diw_factories/` and `docs/project/raw_data_for_factory/`

### 3. Data Imported

- **File:** `docs/project/raw_data_for_factory/1_อ.พระนคร.xls`
- **Result:** 20 factories from Phra Nakhon district, Bangkok
- **Status:** All fields populated including `old_reg_number`

---

## How to Import More Files

1. Place `.xls` files in `docs/project/raw_data_for_factory/`

2. Run the import:

```bash
python3 scripts/import_factories.py
```

3. The script uses `ON CONFLICT (reg_number) DO NOTHING` — duplicate registration numbers are skipped safely.

---

## Column Mapping (Thai → Database)

| Thai Header | DB Column |
|---|---|
| เลขทะเบียนโรงงาน | `reg_number` |
| ชื่อโรงงาน | `name` |
| ผู้ประกอบการ | `operator` |
| ประกอบกิจการ | `business_activity` |
| เลขที่ | `house_number` |
| หมู่ | `village` |
| ซอย | `soi` |
| ถนน | `road` |
| ตำบล | `subdistrict` |
| อำเภอ | `district` |
| จังหวัด | `province` |
| ไปรษณีย์ | `postal_code` |
| โทรศัพท์ | `phone` |
| ประเภท | `type` |
| เงินทุน | `capital_baht` |
| คนงาน | `workers` |
| แรงม้า | `horsepower` |
| TSIC | `tsic` |
| เลขทะเบียนเดิม | `old_reg_number` |

---

## Database Connection

The script reads `DATABASE_URL` from `.env`. Format:

```
DATABASE_URL=postgresql://migrant_user:your-database-password@localhost:5433/migrant_review_db
```

Port `5433` is the external Docker port for PostgreSQL.

---

## Prerequisites

```bash
pip install xlrd psycopg2-binary python-dotenv
```

Docker must be running (`docker compose up -d`).
