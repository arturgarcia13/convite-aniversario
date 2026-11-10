#!/usr/bin/env python3
"""Measure colors from a reference image.

  palette.py IMG [--k 12] [--region x,y,w,h]        dominant flat colors (exact-color clustering)
  palette.py IMG --point x,y [--point x,y] [--r 1]  exact hex at pixels (mean of (2r+1)^2 block)
  palette.py IMG --line x1,y1,x2,y2 [--steps 8]     sample along a line to read a gradient
Add --json for machine-readable output. Coordinates are pixels of the file as given.
"""
import argparse, json, sys
import numpy as np
from PIL import Image

def hexof(c): return "#%02X%02X%02X" % tuple(int(round(v)) for v in c[:3])
def lum(c):
    r, g, b = [v / 255 for v in c[:3]]
    f = lambda u: u / 12.92 if u <= 0.03928 else ((u + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def load(path, region=None):
    im = Image.open(path).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    im = Image.alpha_composite(bg, im).convert("RGB")
    if region:
        x, y, w, h = region
        im = im.crop((x, y, x + w, y + h))
    return im

def dominant(im, k, tol):
    im.thumbnail((700, 700), Image.NEAREST)  # NEAREST keeps exact flat colors
    a = np.asarray(im).reshape(-1, 3).astype(np.int32)
    packed = (a[:, 0] << 16) | (a[:, 1] << 8) | a[:, 2]
    vals, counts = np.unique(packed, return_counts=True)
    order = np.argsort(-counts)[:6000]
    centers, weights = [], []
    for i in order:
        c = np.array([(vals[i] >> 16) & 255, (vals[i] >> 8) & 255, vals[i] & 255])
        for j, cc in enumerate(centers):
            if np.abs(c - cc).max() <= tol:
                weights[j] += counts[i]
                break
        else:
            centers.append(c); weights.append(counts[i])
    total = counts.sum()
    res = sorted(zip(weights, centers), key=lambda t: -t[0])[:k]
    return [{"hex": hexof(c), "rgb": [int(v) for v in c], "share_pct": round(100 * w / total, 2),
             "luminance": round(lum(c), 3)} for w, c in res]

def parse_xy(s): return [int(float(v)) for v in s.split(",")]

def main():
    p = argparse.ArgumentParser()
    p.add_argument("img"); p.add_argument("--k", type=int, default=12)
    p.add_argument("--tol", type=int, default=6, help="merge colors within this per-channel distance")
    p.add_argument("--region"); p.add_argument("--point", action="append")
    p.add_argument("--r", type=int, default=1); p.add_argument("--line"); p.add_argument("--steps", type=int, default=8)
    p.add_argument("--json", action="store_true")
    a = p.parse_args()
    im = load(a.img, parse_xy(a.region) if a.region and not (a.point or a.line) else None)
    out = {"size": list(Image.open(a.img).size)}
    px = np.asarray(load(a.img))
    if a.point:
        out["points"] = []
        for s in a.point:
            x, y = parse_xy(s)
            blk = px[max(0, y - a.r): y + a.r + 1, max(0, x - a.r): x + a.r + 1].reshape(-1, 3)
            out["points"].append({"xy": [x, y], "hex": hexof(blk.mean(0)), "spread": int(blk.max(0).max() - blk.min(0).min())})
    elif a.line:
        x1, y1, x2, y2 = parse_xy(a.line)
        out["gradient"] = []
        for i in range(a.steps):
            t = i / (a.steps - 1)
            x, y = int(x1 + (x2 - x1) * t), int(y1 + (y2 - y1) * t)
            out["gradient"].append({"t": round(t, 3), "xy": [x, y], "hex": hexof(px[y, x])})
        dx, dy = x2 - x1, y2 - y1
        out["line_angle_deg_css"] = round((np.degrees(np.arctan2(dy, dx)) + 90) % 360, 1)
    else:
        out["dominant"] = dominant(im, a.k, a.tol)
    if a.json: print(json.dumps(out, indent=2)); return
    for key, rows in out.items():
        if isinstance(rows, list) and rows and isinstance(rows[0], dict):
            print(f"[{key}]")
            for r in rows: print("  " + "  ".join(f"{k}={v}" for k, v in r.items()))
        elif key != "size": print(f"{key}: {rows}")
    print(f"image size: {out['size']}")

if __name__ == "__main__": main()
