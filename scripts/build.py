#!/usr/bin/env python3
"""Package the static site for GitHub Pages, using Python's standard library."""
from pathlib import Path
from shutil import copy2, copytree

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "dist"
OUTPUT.mkdir(exist_ok=True)
for filename in ("index.html", "404.html", "styles.css", "script.js", ".nojekyll", "robots.txt", "sitemap.xml"):
    copy2(ROOT / filename, OUTPUT / filename)
copytree(ROOT / "assets", OUTPUT / "assets", dirs_exist_ok=True)
print(f"Static site ready: {OUTPUT}")
