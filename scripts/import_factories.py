#!/usr/bin/env python3
"""
Import DIW factory Excel data into PostgreSQL factories table.
Reads all .xls files from diw_factories/ directory.

Usage:
  1. Download factory data: python scripts/download_diw_factories.py
  2. Import to database: python scripts/import_factories.py
"""

import os
import glob
import sys
from pathlib import Path

import xlrd
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Reconfigure stdout/stderr to UTF-8 so Thai filenames print on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Load .env from project root
load_dotenv(Path(__file__).parent.parent / '.env')

OUTPUT_DIR = Path(__file__).parent.parent / "diw_factories"
RAW_DATA_DIR = Path(__file__).parent.parent / "docs" / "project" / "raw_data_for_factory"
BATCH_SIZE = 1000

# Column name mapping (English header -> DB column)
COLUMN_MAP = {
    'Factory_Reg_Number': 'reg_number',
    'Factory_Name': 'name',
    'Operator': 'operator',
    'Business_Activity': 'business_activity',
    'House_Number': 'house_number',
    'Village': 'village',
    'Soi': 'soi',
    'Road': 'road',
    'Subdistrict': 'subdistrict',
    'District': 'district',
    'Province': 'province',
    'Postal_Code': 'postal_code',
    'Phone': 'phone',
    'Type': 'type',
    'Capital_Baht': 'capital_baht',
    'Workers': 'workers',
    'Horsepower': 'horsepower',
    'TSIC': 'tsic',
    'Old_Reg_Number': 'old_reg_number',
}

# Thai header -> English header mapping (for raw DIW data files)
THAI_HEADER_MAP = {
    'เลขทะเบียนโรงงาน': 'Factory_Reg_Number',
    'ชื่อโรงงาน': 'Factory_Name',
    'ผู้ประกอบการ': 'Operator',
    'ประกอบกิจการ': 'Business_Activity',
    'เลขที่': 'House_Number',
    'หมู่': 'Village',
    'ซอย': 'Soi',
    'ถนน': 'Road',
    'ตำบล': 'Subdistrict',
    'อำเภอ': 'District',
    'จังหวัด': 'Province',
    'ไปรษณีย์': 'Postal_Code',
    'โทรศัพท์': 'Phone',
    'ประเภท': 'Type',
    'เงินทุน': 'Capital_Baht',
    'คนงาน': 'Workers',
    'แรงม้า': 'Horsepower',
    'TSIC': 'TSIC',
    'เลขทะเบียนเดิม': 'Old_Reg_Number',
}

DB_COLUMNS = [v for v in COLUMN_MAP.values() if v is not None]


def parse_excel(filepath):
    """Parse an Excel file and return list of factory dicts."""
    factories = []
    try:
        wb = xlrd.open_workbook(filepath)
        sheet = wb.sheet_by_index(0)

        if sheet.nrows < 2:
            return factories

        # Get headers from first row
        headers = sheet.row_values(0)

        # Convert Thai headers to English, then map to DB columns
        col_indices = {}
        for i, header in enumerate(headers):
            if isinstance(header, float):
                header = str(int(header))
            elif isinstance(header, str):
                header = header.strip()
            else:
                header = str(header)

            # Translate Thai header to English if needed
            if header in THAI_HEADER_MAP:
                header = THAI_HEADER_MAP[header]

            if header in COLUMN_MAP and COLUMN_MAP[header] is not None:
                col_indices[COLUMN_MAP[header]] = i

        # Check if we have the required 'name' column
        if 'name' not in col_indices:
            return factories

        # Parse data rows
        for row_idx in range(1, sheet.nrows):
            row = sheet.row_values(row_idx)

            # Skip empty rows
            name_val = row[col_indices['name']] if row else None
            if not isinstance(name_val, str) or not name_val.strip():
                continue

            factory = {}
            for db_col, idx in col_indices.items():
                val = row[idx] if idx < len(row) else None

                # Clean value
                if val is None or val == '':
                    factory[db_col] = None
                elif isinstance(val, str):
                    val = val.strip()
                    # Remove non-breaking spaces
                    val = val.replace('\xa0', ' ')
                    factory[db_col] = val if val else None
                elif isinstance(val, float):
                    # Convert numeric to int if whole number
                    if val == int(val):
                        factory[db_col] = int(val)
                    else:
                        factory[db_col] = val
                else:
                    factory[db_col] = val

            # Skip if no name
            if not factory.get('name'):
                continue

            factories.append(factory)

    except Exception as e:
        print(f"  Error reading {filepath}: {e}")

    return factories


def import_to_db(factories, conn):
    """Batch insert factories into PostgreSQL."""
    if not factories:
        return 0

    query = """
        INSERT INTO factories ({columns})
        VALUES %s
        ON CONFLICT (reg_number) DO NOTHING
    """.format(columns=', '.join(DB_COLUMNS))

    # Prepare values
    values = []
    for f in factories:
        row = tuple(f.get(col) for col in DB_COLUMNS)
        values.append(row)

    with conn.cursor() as cur:
        execute_values(cur, query, values, page_size=BATCH_SIZE)
        return cur.rowcount


def main():
    # Connect to database
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("Error: DATABASE_URL not set in .env")
        sys.exit(1)

    # Convert Prisma connection string format to psycopg2 format
    # prisma+postgres://... -> postgresql://...
    if db_url.startswith('prisma+postgres://'):
        db_url = "postgresql://migrant_user:YOUR_DATABASE_PASSWORD@localhost:5433/migrant_review_db"

    print(f"Connecting to database...")
    conn = psycopg2.connect(db_url)

    # Get all Excel files from both directories
    files = []
    if OUTPUT_DIR.exists():
        files.extend(sorted(glob.glob(str(OUTPUT_DIR / '**' / '*.xls'), recursive=True)))
    if RAW_DATA_DIR.exists():
        files.extend(sorted(glob.glob(str(RAW_DATA_DIR / '**' / '*.xls'), recursive=True)))

    print(f"Found {len(files)} Excel files\n")

    if len(files) == 0:
        print("No Excel files found.")
        print(f"  Place .xls files in: {RAW_DATA_DIR}")
        print(f"  Or run: python scripts/download_diw_factories.py")
        sys.exit(1)

    total_imported = 0
    total_skipped = 0

    for i, filepath in enumerate(files, 1):
        # Parse Excel
        factories = parse_excel(filepath)

        if not factories:
            total_skipped += 1
            continue

        # Import to DB
        try:
            imported = import_to_db(factories, conn)
            total_imported += imported

            if i % 50 == 0 or i == len(files):
                print(f"  [{i}/{len(files)}] {imported} rows from {os.path.basename(filepath)} (total: {total_imported})")
                conn.commit()
        except Exception as e:
            print(f"  Error importing {filepath}: {e}")
            conn.rollback()

    conn.commit()
    conn.close()

    print(f"\nDone! {total_imported} factories imported, {total_skipped} files skipped")


if __name__ == "__main__":
    main()
