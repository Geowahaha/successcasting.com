#!/usr/bin/env python3
"""
Two-folder product image sync:
- original/ : raw source files
- web/      : web-ready files (auto-generated)

Also syncs into Next.js public folder so files are instantly usable at:
/products/generated/<file>.webp
"""

from __future__ import annotations

import argparse
import io
import json
import re
import shutil
import time
from pathlib import Path

from PIL import Image

try:
    from rembg import remove as rembg_remove

    HAS_REMBG = True
except Exception:
    HAS_REMBG = False


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "image"


def collect_images(folder: Path) -> list[Path]:
    files: list[Path] = []
    for p in folder.rglob("*"):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(p)
    return sorted(files)


def remove_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    if not HAS_REMBG:
        return rgba
    out = rembg_remove(rgba)
    if isinstance(out, Image.Image):
        return out.convert("RGBA")
    if isinstance(out, (bytes, bytearray)):
        return Image.open(io.BytesIO(out)).convert("RGBA")
    return rgba


def make_square(image: Image.Image, size: int, background: str) -> Image.Image:
    src = image.convert("RGBA")
    ratio = min(size / src.width, size / src.height)
    w = max(1, int(src.width * ratio))
    h = max(1, int(src.height * ratio))
    resized = src.resize((w, h), Image.Resampling.LANCZOS)

    if background == "white":
        canvas = Image.new("RGB", (size, size), (255, 255, 255))
        alpha = resized.split()[3]
        canvas.paste(resized.convert("RGB"), ((size - w) // 2, (size - h) // 2), alpha)
        return canvas

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - w) // 2, (size - h) // 2), resized)
    return canvas


def build_web_name(source_file: Path, used: set[str]) -> str:
    rel_key = f"{source_file.parent.name}-{source_file.stem}"
    base = slugify(rel_key)
    name = f"{base}.webp"
    idx = 2
    while name in used:
        name = f"{base}-{idx}.webp"
        idx += 1
    used.add(name)
    return name


def process_all(
    original_dir: Path,
    web_dir: Path,
    nextjs_public_dir: Path,
    size: int,
    quality: int,
    background: str,
) -> dict:
    original_dir.mkdir(parents=True, exist_ok=True)
    web_dir.mkdir(parents=True, exist_ok=True)
    nextjs_public_dir.mkdir(parents=True, exist_ok=True)

    # Clean web output each run to avoid stale assets.
    for old in web_dir.glob("*.webp"):
        old.unlink(missing_ok=True)

    files = collect_images(original_dir)
    used: set[str] = set()
    items = []

    for src in files:
        output_name = build_web_name(src, used)
        web_path = web_dir / output_name
        nextjs_path = nextjs_public_dir / output_name

        with Image.open(src) as img:
            cut = remove_background(img)
            ready = make_square(cut, size=size, background=background)
            ready.save(web_path, format="WEBP", quality=quality, method=6)
            ready.save(nextjs_path, format="WEBP", quality=quality, method=6)

        items.append(
            {
                "id": web_path.stem,
                "sourceFile": str(src),
                "webFile": str(web_path),
                "nextjsPublicFile": str(nextjs_path),
                "nextjsSrc": f"/products/generated/{web_path.name}",
                "width": size,
                "height": size,
                "format": "webp",
            }
        )

    manifest = {
        "standard": {
            "size": f"{size}x{size}",
            "format": "webp",
            "quality": quality,
            "background": background,
            "model": "rembg+resize+webp" if HAS_REMBG else "resize+webp",
        },
        "counts": {"source": len(files), "processed": len(items)},
        "items": items,
    }

    manifest_path = web_dir / "manifest.nextjs.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    shutil.copy2(manifest_path, nextjs_public_dir / "manifest.nextjs.json")
    return {"manifest": manifest_path, "source_count": len(files), "processed_count": len(items)}


def scan_state(folder: Path) -> dict[str, float]:
    state: dict[str, float] = {}
    for p in collect_images(folder):
        state[str(p)] = p.stat().st_mtime
    return state


def run_watch(
    original_dir: Path,
    web_dir: Path,
    nextjs_public_dir: Path,
    size: int,
    quality: int,
    background: str,
    interval_sec: float,
) -> None:
    print("Watch mode started")
    print(f"Watching: {original_dir}")
    last_state = {}
    while True:
        current = scan_state(original_dir)
        if current != last_state:
            result = process_all(
                original_dir=original_dir,
                web_dir=web_dir,
                nextjs_public_dir=nextjs_public_dir,
                size=size,
                quality=quality,
                background=background,
            )
            print(
                f"Synced source={result['source_count']} processed={result['processed_count']} manifest={result['manifest']}"
            )
            last_state = current
        time.sleep(interval_sec)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Two-folder automatic image sync for Next.js")
    parser.add_argument(
        "--original-dir",
        type=Path,
        default=Path(r"D:\Success_Suphancasting\Product_image\original"),
        help="Source folder for original files",
    )
    parser.add_argument(
        "--web-dir",
        type=Path,
        default=Path(r"D:\Success_Suphancasting\Product_image\web"),
        help="Web-ready output folder",
    )
    parser.add_argument(
        "--nextjs-public-dir",
        type=Path,
        default=Path(r"D:\Success_Suphancasting\suphancasting\public\products\generated"),
        help="Next.js public output folder",
    )
    parser.add_argument("--size", type=int, default=1200)
    parser.add_argument("--quality", type=int, default=85)
    parser.add_argument("--background", choices=("transparent", "white"), default="transparent")
    parser.add_argument("--watch", action="store_true", help="Keep watching for new/updated files")
    parser.add_argument("--interval-sec", type=float, default=2.0, help="Watch polling interval")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.size < 256:
        raise SystemExit("size must be >= 256")
    if args.quality < 1 or args.quality > 100:
        raise SystemExit("quality must be between 1 and 100")

    # One-shot run always happens first
    result = process_all(
        original_dir=args.original_dir,
        web_dir=args.web_dir,
        nextjs_public_dir=args.nextjs_public_dir,
        size=args.size,
        quality=args.quality,
        background=args.background,
    )
    print(
        f"Initial sync done: source={result['source_count']} processed={result['processed_count']} manifest={result['manifest']}"
    )
    if not HAS_REMBG:
        print("Warning: rembg not found. Background removal is skipped.")

    if args.watch:
        run_watch(
            original_dir=args.original_dir,
            web_dir=args.web_dir,
            nextjs_public_dir=args.nextjs_public_dir,
            size=args.size,
            quality=args.quality,
            background=args.background,
            interval_sec=args.interval_sec,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

