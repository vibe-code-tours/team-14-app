# Data Migration Scripts

These scripts import factory data from Thailand's Department of Industrial Works (DIW) into the database.

## Prerequisites

```bash
# Install Python dependencies
pip install -r scripts/requirements.txt

# Install Playwright browser
playwright install chromium
```

## Step 1: Download Factory Data

Download Excel files from DIW website:

```bash
python scripts/download_diw_factories.py
```

This creates a `diw_factories/` directory with Excel files organized by region/province/district.

## Step 2: Import to Database

Import the downloaded Excel files into PostgreSQL:

```bash
python scripts/import_factories.py
```

## Data Source

- **Website**: http://userdb.diw.go.th/factoryPublic/tumbol.asp
- **Format**: Excel (.xls) files with factory registration data
- **Coverage**: All 77 provinces across 6 regions of Thailand

## Files

| File | Description |
|------|-------------|
| `download_diw_factories.py` | Scrapes DIW website and downloads Excel files |
| `import_factories.py` | Reads Excel files and imports into PostgreSQL |
| `requirements.txt` | Python dependencies |
