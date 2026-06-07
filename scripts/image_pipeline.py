#!/usr/bin/env python3
"""
Batch image pipeline for product assets:
1) Remove background (rembg if available, fallback keeps original)
2) Prepare cleaned folder (manual override friendly)
3) Export web-ready square WEBP files for Next.js
4) Generate manifest JSON
"""

from __future__ import annotations

import argparse
import io
import json
import re
import shutil
from pathlib import Path
from typing import Iterable

from PIL import Image

try:
    from rembg import remove as rembg_remove

    HAS_REMBG = True
except Exception:
    HAS_REMBG = False


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}
OUTPUT_DIR_NAMES = {"bg_removed", "cleaned", "web_ready"}


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "image"


def collect_source_images(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        if any(part.lower() in OUTPUT_DIR_NAMES for part in path.parts):
            continue
        files.append(path)
    return sorted(files)


def unique_file_path(dest_dir: Path, base_slug: str, suffix: str, used: set[str]) -> Path:
    candidate = f"{base_slug}{suffix}"
    index = 2
    while candidate in used or (dest_dir / candidate).exists():
        candidate = f"{base_slug}-{index}{suffix}"
        index += 1
    used.add(candidate)
    return dest_dir / candidate


def remove_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    if not HAS_REMBG:
        return rgba
    result = rembg_remove(rgba)
    if isinstance(result, Image.Image):
        return result.convert("RGBA")
    if isinstance(result, (bytes, bytearray)):
        return Image.open(io.BytesIO(result)).convert("RGBA")
    return rgba


def make_square_canvas(image: Image.Image, size: int, background: str) -> Image.Image:
    source = image.convert("RGBA")
    ratio = min(size / source.width, size / source.height)
    new_w = max(1, int(source.width * ratio))
    new_h = max(1, int(source.height * ratio))
    resized = source.resize((new_w, new_h), Image.Resampling.LANCZOS)

    if background == "white":
        canvas = Image.new("RGB", (size, size), (255, 255, 255))
        alpha = resized.split()[3]
        rgb_resized = resized.convert("RGB")
        x = (size - new_w) // 2
        y = (size - new_h) // 2
        canvas.paste(rgb_resized, (x, y), alpha)
        return canvas

    canvas_rgba = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    canvas_rgba.paste(resized, (x, y), resized)
    return canvas_rgba


def ensure_dirs(*paths: Path) -> None:
    for path in paths:
        path.mkdir(parents=True, exist_ok=True)


def run_pipeline(
    root: Path,
    nextjs_public_dir: Path,
    size: int,
    quality: int,
    background: str,
) -> dict:
    bg_removed_dir = root / "bg_removed"
    cleaned_dir = root / "cleaned"
    web_ready_dir = root / "web_ready"
    ensure_dirs(bg_removed_dir, cleaned_dir, web_ready_dir, nextjs_public_dir)

    source_images = collect_source_images(root)
    used_names: set[str] = set()
    processed = []

    for source in source_images:
        base_slug = slugify(source.stem)

        bg_removed_path = unique_file_path(bg_removed_dir, base_slug, ".png", used_names)
        cleaned_path = cleaned_dir / bg_removed_path.name
        web_ready_path = web_ready_dir / f"{bg_removed_path.stem}.webp"
        nextjs_path = nextjs_public_dir / web_ready_path.name

        with Image.open(source) as original:
            cutout = remove_background(original)
            cutout.save(bg_removed_path, format="PNG", optimize=True)

        if not cleaned_path.exists():
            shutil.copy2(bg_removed_path, cleaned_path)

        with Image.open(cleaned_path) as cleaned_image:
            square = make_square_canvas(cleaned_image, size=size, background=background)
            square.save(web_ready_path, format="WEBP", quality=quality, method=6)
            square.save(nextjs_path, format="WEBP", quality=quality, method=6)

        processed.append(
            {
                "id": web_ready_path.stem,
                "sourceFile": str(source),
                "bgRemovedFile": str(bg_removed_path),
                "cleanedFile": str(cleaned_path),
                "webReadyFile": str(web_ready_path),
                "nextjsPublicFile": str(nextjs_path),
                "nextjsSrc": f"/products/generated/{nextjs_path.name}",
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
            "nextjsPath": "/products/generated/*.webp",
        },
        "counts": {"source": len(source_images), "processed": len(processed)},
        "items": processed,
    }

    manifest_path = web_ready_dir / "manifest.nextjs.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    shutil.copy2(manifest_path, nextjs_public_dir / "manifest.nextjs.json")
    return {"manifest_path": str(manifest_path), "counts": manifest["counts"]}


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Batch product image pipeline for Next.js")
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(r"D:\Success_Suphancasting\Product_image"),
        help="Root image folder that contains source files",
    )
    parser.add_argument(
        "--nextjs-public-dir",
        type=Path,
        default=Path(r"D:\Success_Suphancasting\suphancasting\public\products\generated"),
        help="Output folder inside Next.js public directory",
    )
    parser.add_argument("--size", type=int, default=1200, help="Square output size in px")
    parser.add_argument(
        "--quality",
        type=int,
        default=85,
        help="WEBP quality (1-100)",
    )
    parser.add_argument(
        "--background",
        choices=("transparent", "white"),
        default="transparent",
        help="Canvas background for final web-ready exports",
    )
    return parser.parse_args(argv)


def main() -> int:
    args = parse_args()
    if not args.root.exists():
        raise SystemExit(f"Image root does not exist: {args.root}")
    if args.quality < 1 or args.quality > 100:
        raise SystemExit("quality must be between 1 and 100")
    if args.size < 256:
        raise SystemExit("size must be >= 256")

    result = run_pipeline(
        root=args.root,
        nextjs_public_dir=args.nextjs_public_dir,
        size=args.size,
        quality=args.quality,
        background=args.background,
    )
    print("Pipeline completed")
    print(f"Manifest: {result['manifest_path']}")
    print(f"Source: {result['counts']['source']} | Processed: {result['counts']['processed']}")
    if not HAS_REMBG:
        print("Warning: rembg not found. Background removal step used original images.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

