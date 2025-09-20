import os
import time
import requests
import urllib.parse
from tqdm import tqdm

TIMEMAP_API = "https://web.archive.org/web/timemap/json"
WAYBACK_PREFIX = "https://web.archive.org/web/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
}

BASE_PATHS = [
    "http://blst.msn.com",
    "http://wst.s-msn.com"
]

LOCAL_ROOT = os.path.abspath(os.path.dirname(__file__))

def get_archived_files(base_url):
    print(f"\nFetching timemap for {base_url}")
    params = {
        "url": base_url,
        "matchType": "prefix",
        "collapse": "urlkey",
        "output": "json",
        "fl": "original,mimetype,timestamp,endtimestamp,groupcount,uniqcount",
        "filter": "!statuscode:[45]..",
        "limit": "10000"
    }

    try:
        response = requests.get(TIMEMAP_API, headers=HEADERS, params=params, timeout=30)
        response.raise_for_status()
        results = response.json()

        filtered = [entry for entry in results[1:] if entry[2] < "20160101000000"]
        return filtered

    except Exception as e:
        print(f"Failed to fetch timemap {e}")
        return []

def sanitize_netloc(parsed):
    netloc = parsed.netloc
    if (parsed.scheme == "http" and netloc.endswith(":80")) or \
       (parsed.scheme == "https" and netloc.endswith(":443")):
        netloc = netloc.rsplit(":", 1)[0]

    return netloc

def download_file(original_url, timestamp, retries=3):
    snapshot_url = f"{WAYBACK_PREFIX}{timestamp}if_/{original_url}"

    parsed = urllib.parse.urlparse(original_url)
    netloc = sanitize_netloc(parsed)
    relative_path = netloc + parsed.path

    local_path = os.path.join(LOCAL_ROOT, relative_path.lstrip("/"))

    if os.path.isfile(local_path):
        return

    os.makedirs(os.path.dirname(local_path), exist_ok=True)

    for attempt in range(1, retries + 1):
        try:
            r = requests.get(snapshot_url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            with open(local_path, "wb") as f:
                f.write(r.content)

            print(f"Downloaded {relative_path}")
            return
        except Exception as e:
            if attempt < retries:
                wait = 2 ** (attempt - 1)
                print(f"Retry {attempt}/{retries} for {original_url} in {wait}s...")
                time.sleep(wait)
            else:
                print(f"Failed to download {original_url} ({timestamp}): {e}")

def main():
    for base_url in BASE_PATHS:
        files = get_archived_files(base_url)

        for entry in tqdm(files, desc=f"Downloading {base_url}", unit="file"):
            try:
                original, mime, timestamp, endtimestamp, groupcount, uniqcount = entry
                download_file(original, timestamp)
            except Exception as e:
                print(f"Skipped {e}")

main()