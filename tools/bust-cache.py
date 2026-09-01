#!/usr/bin/env python3
"""
Append a content hash to css/js references so browsers refetch them
whenever they actually change, instead of serving a stale cached copy.

Run from the repo root after editing anything in css/ or js/:

    python3 tools/bust-cache.py
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ["css/styles.css", "js/main.js", "js/hero-images.js"]


def short_hash(path: pathlib.Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()[:8]


def main() -> int:
    hashes = {}
    for rel in ASSETS:
        p = ROOT / rel
        if p.exists():
            hashes[rel] = short_hash(p)

    changed = []
    for html in list(ROOT.glob("*.html")) + list(ROOT.glob("projects/*.html")):
        text = html.read_text()
        original = text
        for rel, h in hashes.items():
            # matches both "css/styles.css" and "../css/styles.css",
            # with or without an existing ?v=... suffix
            pattern = re.compile(r'((?:\.\./)?' + re.escape(rel) + r')(\?v=[0-9a-f]+)?(["\'])')
            text = pattern.sub(lambda m: f"{m.group(1)}?v={h}{m.group(3)}", text)
        if text != original:
            html.write_text(text)
            changed.append(html.relative_to(ROOT).as_posix())

    for rel, h in hashes.items():
        print(f"  {rel:22s} v={h}")
    print(f"\n  updated {len(changed)} file(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
