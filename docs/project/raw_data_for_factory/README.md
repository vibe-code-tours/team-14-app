# DIW Factory Data (ข้อมูลโรงงานแยกตามพื้นที่)

Downloaded from [กรมโรงงานอุตสาหกรรม (DIW)](http://userdb.diw.go.th/factoryPublic/tumbol.asp)

## Folder Structure

```
diw_factories/
├── 1_กทม_และภาคกลาง/          (Bangkok & Central - 22 provinces)
├── 2_ภาคเหนือ/                 (Northern - 9 provinces)
├── 3_ภาคตะวันออกเฉียงเหนือ/   (Northeastern - 20 provinces)
├── 4_ภาคตะวันออก/              (Eastern - 7 provinces)
├── 5_ภาคตะวันตก/               (Western - 5 provinces)
└── 6_ภาคใต้/                   (Southern - 14 provinces)
```

Each region contains provinces, each province contains district `.xls` files:
```
6_ภาคใต้/
├── 80_จ.นครศรีธรรมราช/
│   ├── 1_อ.เมืองนครศรีธรรมราช.xls
│   ├── 2_อ.พรหมคีรี.xls
│   └── ...
├── 81_จ.กระบี่/
│   └── ...
```

## Data Info

- **Format:** Excel .xls (OLE2/Composite Document File V2)
- **Scope:** Factories with ≥50 HP or ≥50 workers
- **Excludes:** Not-yet-operating, temporarily closed, or permanently closed factories
- **Total:** 979 district files, ~60 MB

## How to Read the Data

### Python (pandas)
```python
import pandas as pd

# Read a single district file
df = pd.read_excel('1_กทม_และภาคกลาง/10_จ.กรุงเทพมหานคร/1_อ.พระนคร.xls')

# Read all files in a province
import glob
files = glob.glob('1_กทม_และภาคกลาง/10_จ.กรุงเทพมหานคร/*.xls')
dfs = [pd.read_excel(f) for f in files]
all_factories = pd.concat(dfs, ignore_index=True)
```

### Python (xlrd for .xls)
```python
import xlrd
wb = xlrd.open_workbook('1_กทม_และภาคกลาง/10_จ.กรุงเทพมหานคร/1_อ.พระนคร.xls')
sheet = wb.sheet_by_index(0)
for row in range(sheet.nrows):
    print(sheet.row_values(row))
```

## Re-download / Update

Run the download script from the parent directory:

```bash
cd /path/to/migrant-review-app
python3 download_diw_factories.py
```

- Already downloaded files are skipped (safe to re-run)
- Script uses Playwright (tree scraping) + requests (file download)
- Takes ~5-10 minutes for a full fresh download

## Links

- Source: http://userdb.diw.go.th/factoryPublic/tumbol.asp
- Script: [download_diw_factories.py](../download_diw_factories.py)
