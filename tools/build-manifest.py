#!/usr/bin/env python3
"""Generate gallery/index.json for the MyOS Gallery app.

GitHub Pages (and most static hosts) can't list a directory's contents, so the
app reads this committed manifest instead of scanning folders at runtime.
Add or remove images under gallery/, then run this from the repo root:

    python tools/build-manifest.py
"""
import json
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.join(HERE, "gallery")
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"}

manifest = {}
for dirpath, dirnames, filenames in os.walk(ROOT):
    rel = os.path.relpath(dirpath, HERE).replace(os.sep, "/")  # "gallery" or "gallery/wallpapers"
    folders = sorted(d for d in dirnames if not d.startswith("."))
    images = sorted(f for f in filenames if os.path.splitext(f)[1].lower() in IMAGE_EXT)
    manifest[rel] = {"folders": folders, "images": images}

out = os.path.join(ROOT, "index.json")
with open(out, "w", encoding="utf-8", newline="\n") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")
print("wrote", os.path.relpath(out, HERE), "-", len(manifest), "folders")
