#!/usr/bin/env python3
import html
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHANNELS = {
    "gevurah": "https://t.me/s/gevurahpictures",
    "eatAfrica": "https://t.me/s/eatAfrica",
}
URL_PATTERN = re.compile(r"https?://[^\"'<>\s)]+", re.IGNORECASE)


def fetch(url):
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 KibiraImageRefresh/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "ignore")


def extract_images(page):
    page = html.unescape(page).replace("\\/", "/")
    results = []
    seen = set()
    for candidate in URL_PATTERN.findall(page):
        candidate = candidate.rstrip("'\\\"")
        lower = candidate.lower()
        if "telesco.pe/file/" not in lower and "telegram-cdn" not in lower:
            continue
        if candidate in seen:
            continue
        seen.add(candidate)
        results.append({"url": candidate})
    return results[:24]


images = {}
for name, url in CHANNELS.items():
    try:
        images[name] = extract_images(fetch(url))
    except Exception as error:
        print(f"{name}: {error}")
        images[name] = []

payload = {
    "updatedAt": datetime.now(timezone.utc).isoformat(),
    "images": images,
    "sources": {
        "gevurah": "https://t.me/gevurahpictures",
        "eatAfrica": "https://t.me/eatAfrica",
    },
}
(ROOT / "images.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
print(json.dumps({key: len(value) for key, value in images.items()}))
