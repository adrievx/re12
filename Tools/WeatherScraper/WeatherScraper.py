import re
import json
import time
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "WeatherScraper/1.0" # TODO: change later
}

BASE_INDEX = "https://weather.codes"
GEOCODER = "https://nominatim.openstreetmap.org/search"

CODE_RE = re.compile(r"\b([A-Z]{2,4}\d{4})\b", re.IGNORECASE)

def scrape_codes_for_country(country_path):
    url = BASE_INDEX + country_path

    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    r.encoding = "utf-8"
    soup = BeautifulSoup(r.text, "html.parser")

    main = soup.find("main") or soup.find("article") or soup.find("div", id="content")
    text = (main.get_text("\n") if main else soup.get_text("\n"))
    lines = [ln.strip() for ln in text.splitlines()]

    results = []
    seen_codes = set()

    for i, line in enumerate(lines):
        if not line:
            continue
        for m in CODE_RE.finditer(line):
            code = m.group(1).upper()
            if code in seen_codes:
                continue
            seen_codes.add(code)

            name_candidate = line[: m.start()].strip() or line[m.end() :].strip()
            if not name_candidate:
                back = 1
                while back <= 2 and i - back >= 0:
                    prev = lines[i - back].strip()
                    if prev:
                        name_candidate = prev
                        break
                    back += 1

            wc_key = "wc:" + code if not code.lower().startswith("wc:") else code
            results.append((wc_key, name_candidate))

    return results

def geocode_city(name, country_hint=None, delay=0.1):
    params = {"q": name, "format": "json", "limit": 1}
    if country_hint:
        params["countrycodes"] = country_hint.lower()

    try:
        r = requests.get(GEOCODER, params=params, headers=HEADERS, timeout=20)
        r.raise_for_status()

        data = r.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"Geocoding failed for {name}: {e}")

    return None, None
    time.sleep(delay)

def build_db(country_paths, out_file="locations.json", delay=0.1):
    db = {}
    for path in country_paths:
        codes = scrape_codes_for_country(path)
        print(f"Found {len(codes)} for {path}")

        if "france" in path:
            country_hint = "fr"
            suffix = "FRA"
        elif "united-kingdom" in path:
            country_hint = "gb"
            suffix = "GBR"
        else:
            country_hint = None
            suffix = None

        for idx, (code, display_name) in enumerate(codes, 1):
            lat, lon = geocode_city(display_name, country_hint)
            if lat is None or lon is None:
                print(f"[{idx}/{len(codes)}] {code} -> {display_name} SKIPPED (no coord data)")
                continue

            name_with_suffix = (
                f"{display_name}, {suffix}" if suffix else display_name
            )

            db[code] = {
                "name": name_with_suffix,
                "lat": lat,
                "lon": lon,
            }

            print(f"[{idx}/{len(codes)}] {code} -> {name_with_suffix} ({lat}, {lon})")
            time.sleep(delay)

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Saved", out_file)

paths = ["/france", "/united-kingdom"]
build_db(paths, out_file="locations.json", delay=0.1)