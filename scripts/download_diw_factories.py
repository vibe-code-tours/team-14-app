#!/usr/bin/env python3
"""
Download all factory data from DIW (Department of Industrial Works) Thailand
with folder structure: region/province/district.xls

Uses Playwright to scrape the tree structure, then requests to download files.

Source: https://userdb.diw.go.th/factoryPublic/tumbol.asp

Usage:
  pip install playwright requests
  playwright install chromium
  python scripts/download_diw_factories.py
"""

import os
import re
import time
import sys
from pathlib import Path

import requests
from playwright.sync_api import sync_playwright

BASE_URL = "https://userdb.diw.go.th/factoryPublic/tumbol.asp"
DOWNLOAD_URL = "https://userdb.diw.go.th/factoryPublic/results3.asp"
OUTPUT_DIR = Path(__file__).parent.parent / "diw_factories"

# Region mapping
REGIONS = {
    1: "กทม_และภาคกลาง",
    2: "ภาคเหนือ",
    3: "ภาคตะวันออกเฉียงเหนือ",
    4: "ภาคตะวันออก",
    5: "ภาคตะวันตก",
    6: "ภาคใต้",
}


def sanitize_filename(name):
    """Remove or replace characters not suitable for filenames."""
    name = name.strip()
    name = re.sub(r'[/\\:*?"<>|]', '_', name)
    return name


def parse_sclk_args(href):
    """Parse sclk(region,province,district,subdistrict) arguments."""
    match = re.search(r'sclk\((\d+),(\d+),(\d+),(\d+)\)', href)
    if match:
        return tuple(int(x) for x in match.groups())
    return None


def navigate_and_wait(page, region_id, province_id=0, district_id=0, subdistrict_id=0):
    """Navigate using sclk() and wait for page to fully load."""
    js_call = f'sclk({region_id},{province_id},{district_id},{subdistrict_id})'
    with page.expect_navigation(wait_until='domcontentloaded', timeout=15000):
        page.evaluate(js_call)
    time.sleep(0.3)


def safe_query_links(page, retries=3):
    """Query sclk links with retry on errors."""
    for attempt in range(retries):
        try:
            page.wait_for_selector('a[href*="sclk"]', timeout=10000)
            return page.query_selector_all('a[href*="sclk"]')
        except Exception:
            if attempt < retries - 1:
                time.sleep(1)
            else:
                raise
    return []


def download_file(region_id, province_id, district_id, output_path):
    """Download Excel file using requests (POST to results3.asp)."""
    if os.path.exists(output_path):
        return True

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    data = {
        'level0': str(region_id),
        'level1': str(province_id),
        'level2': str(district_id),
        'level3': '',
    }

    try:
        resp = requests.post(DOWNLOAD_URL, data=data, timeout=30)
        if resp.status_code == 200 and len(resp.content) > 100:
            with open(output_path, 'wb') as f:
                f.write(resp.content)
            return True
        else:
            print(f"      Bad response: {resp.status_code}, size={len(resp.content)}")
            return False
    except Exception as e:
        print(f"      Error: {e}")
        return False


def main():
    print("Downloading factory data from DIW Thailand...")
    print(f"Output: {OUTPUT_DIR}\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to main page
        page.goto(BASE_URL, wait_until='domcontentloaded')
        page.wait_for_load_state('networkidle')
        print("Page loaded. Scraping tree structure...\n")

        total_downloads = 0
        total_failures = 0

        for region_id, region_name in REGIONS.items():
            print(f"[Region {region_id}] {region_name}")
            region_dir = OUTPUT_DIR / f"{region_id}_{sanitize_filename(region_name)}"

            # Expand region to get provinces
            navigate_and_wait(page, region_id)

            # Collect provinces
            provinces = []
            links = safe_query_links(page)
            for link in links:
                href = link.get_attribute('href') or ''
                text = link.inner_text().strip()
                args = parse_sclk_args(href)
                if args and args[0] == region_id and args[1] != 0 and args[2] == 0 and args[3] == 0:
                    provinces.append((text, args[1]))

            print(f"  {len(provinces)} provinces found")

            for province_name, province_id in provinces:
                print(f"  [Province {province_id}] {province_name}")
                province_dir = region_dir / f"{province_id}_{sanitize_filename(province_name)}"

                # Expand province to get districts
                navigate_and_wait(page, region_id, province_id)

                # Collect districts
                districts = []
                links = safe_query_links(page)
                for link in links:
                    href = link.get_attribute('href') or ''
                    text = link.inner_text().strip()
                    args = parse_sclk_args(href)
                    if args and args[0] == region_id and args[1] == province_id and args[2] != 0 and args[3] == 0:
                        districts.append((text, args[2]))

                print(f"    {len(districts)} districts")

                for district_name, district_id in districts:
                    output_path = province_dir / f"{district_id}_{sanitize_filename(district_name)}.xls"

                    if output_path.exists():
                        print(f"    [SKIP] {district_name}")
                        total_downloads += 1
                        continue

                    ok = download_file(region_id, province_id, district_id, str(output_path))
                    if ok:
                        size = output_path.stat().st_size
                        print(f"    [OK] {district_name} ({size:,} bytes)")
                        total_downloads += 1
                    else:
                        print(f"    [FAIL] {district_name}")
                        total_failures += 1

                    time.sleep(0.2)

        browser.close()

        print(f"\n{'='*60}")
        print(f"Done! {total_downloads} downloaded, {total_failures} failed")
        print(f"Location: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
