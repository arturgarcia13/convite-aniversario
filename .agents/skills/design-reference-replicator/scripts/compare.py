#!/usr/bin/env python3
"""Compare a built copy against the reference and report where they differ.

  compare.py REF COPY [--out dir] [--grid 6x10]
Writes diff_heatmap.png and side_by_side.png, prints JSON: MAE, SSIM, worst grid cells, palette delta.
Targets for flat UI at the same size: SSIM >= 0.97 and MAE <= 3 (0-255). Photos/3D will score lower; judge those by eye.
"""
import argparse, json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from palette import dominant, load

def main():
    p = argparse.ArgumentParser(); p.add_argument("ref"); p.add_argument("copy")
    p.add_argument("--out", default="compare_out"); p.add_argument("--grid", default="6x10")
    a = p.parse_args(); os.makedirs(a.out, exist_ok=True)
    R = load(a.ref); C = load(a.copy); warn = None
    if abs(R.width / R.height - C.width / C.height) > 0.01: warn = "aspect ratios differ; copy was stretched to match"
    C = C.resize(R.size, Image.LANCZOS)
    r, c = np.asarray(R).astype(float), np.asarray(C).astype(float)
    err = np.abs(r - c).mean(axis=2)
    out = {"size": list(R.size), "warning": warn, "mae": round(float(err.mean()), 3)}
    try:
        from skimage.metrics import structural_similarity as ssim
        out["ssim"] = round(float(ssim(np.asarray(R.convert("L")), np.asarray(C.convert("L")))), 4)
    except Exception: out["ssim"] = None
    gx, gy = [int(v) for v in a.grid.lower().split("x")]
    H, W = err.shape; cells = []
    for j in range(gy):
        for i in range(gx):
            blk = err[j * H // gy:(j + 1) * H // gy, i * W // gx:(i + 1) * W // gx]
            cells.append({"col": i, "row": j, "mae": round(float(blk.mean()), 2),
                          "box_px": [i * W // gx, j * H // gy, W // gx, H // gy]})
    out["worst_cells"] = sorted(cells, key=lambda t: -t["mae"])[:8]
    out["palette_ref"] = [d["hex"] for d in dominant(R.copy(), 6, 6)]
    out["palette_copy"] = [d["hex"] for d in dominant(C.copy(), 6, 6)]
    heat = np.clip(err * 4, 0, 255).astype(np.uint8)
    Image.fromarray(heat).save(os.path.join(a.out, "diff_heatmap.png"))
    sbs = Image.new("RGB", (R.width * 2 + 10, R.height), (128, 128, 128)); sbs.paste(R, (0, 0)); sbs.paste(C, (R.width + 10, 0))
    sbs.save(os.path.join(a.out, "side_by_side.png"))
    out["pass"] = bool((out["ssim"] or 0) >= 0.97 and out["mae"] <= 3)
    print(json.dumps(out, indent=1))

if __name__ == "__main__": main()
