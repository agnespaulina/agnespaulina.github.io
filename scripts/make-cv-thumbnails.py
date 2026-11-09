#!/usr/bin/env python3
"""Regenerate the CV thumbnails shown on cv.html (first page of each CV PDF).

Run after you replace a CV PDF in assets/documents/:
    python3 scripts/make-cv-thumbnails.py

Needs: poppler (macOS: `brew install poppler`) and Pillow (`pip3 install pillow`).
"""
import subprocess, tempfile, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
WIDTH = 1150  # px; shown at max 383 px wide, so this stays sharp on 3x screens

for lang in ("sv", "en"):
    pdf = ROOT / "assets/documents" / f"agnes_sandberg_cv_{lang}.pdf"
    out = ROOT / "assets/images" / f"cv_preview_{lang}.webp"
    with tempfile.TemporaryDirectory() as tmp:
        prefix = pathlib.Path(tmp) / "page"
        subprocess.run(
            ["pdftoppm", "-f", "1", "-l", "1", "-scale-to-x", str(WIDTH),
             "-scale-to-y", "-1", "-png", str(pdf), str(prefix)],
            check=True, stderr=subprocess.DEVNULL,
        )
        png = next(pathlib.Path(tmp).glob("page*.png"))
        Image.open(png).convert("RGB").save(out, "WEBP", quality=82, method=6)
    print("wrote", out.relative_to(ROOT))
