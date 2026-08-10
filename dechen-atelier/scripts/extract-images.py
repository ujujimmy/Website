#!/usr/bin/env python3
"""
Pulls the photographs out of the salon's catalog PDF into public/img/.

Run once, when the catalog changes:

    python3 scripts/extract-images.py ../path/to/catalog.pdf

Images come out as JPEG capped at 1600px on the long edge — next/image handles
AVIF/WebP negotiation and responsive widths from there, so there is no point
shipping the originals. Tiny images (icons, the heart divider, colour swatches
in the layout) are skipped.
"""

import sys
import os
import fitz  # pymupdf

MIN_EDGE = 400          # anything smaller is page furniture, not a photograph
MAX_EDGE = 1600         # cap; the largest rendered slot is ~1200px @2x
JPEG_QUALITY = 82


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    src = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "public/img"
    os.makedirs(out_dir, exist_ok=True)

    doc = fitz.open(src)
    seen: set[int] = set()
    kept = 0

    for page_index in range(len(doc)):
        for img in doc[page_index].get_images(full=True):
            xref = img[0]
            if xref in seen:
                continue           # the same photo can be placed twice
            seen.add(xref)

            pix = fitz.Pixmap(doc, xref)

            # CMYK and other exotic colourspaces have to go through RGB before
            # they can be written as JPEG.
            if pix.colorspace is None or pix.n - pix.alpha >= 4:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            if pix.alpha:
                pix = fitz.Pixmap(fitz.csRGB, pix)

            if min(pix.width, pix.height) < MIN_EDGE:
                pix = None
                continue

            longest = max(pix.width, pix.height)
            if longest > MAX_EDGE:
                pix = _downscale(pix, MAX_EDGE / longest)

            name = f"p{page_index + 1:02d}-{xref}.jpg"
            path = os.path.join(out_dir, name)
            pix.save(path, jpg_quality=JPEG_QUALITY)
            print(f"{name}\t{pix.width}x{pix.height}\t{os.path.getsize(path) // 1024}KB")
            kept += 1
            pix = None

    print(f"\n{kept} images written to {out_dir}/")
    return 0


def _downscale(pix: "fitz.Pixmap", scale: float) -> "fitz.Pixmap":
    """PyMuPDF has no direct resize, so re-render the pixmap through a matrix."""
    doc = fitz.open()
    page = doc.new_page(width=pix.width * scale, height=pix.height * scale)
    page.insert_image(page.rect, pixmap=pix)
    return page.get_pixmap(matrix=fitz.Identity, colorspace=fitz.csRGB)


if __name__ == "__main__":
    sys.exit(main())
