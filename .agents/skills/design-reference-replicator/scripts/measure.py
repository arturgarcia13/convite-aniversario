#!/usr/bin/env python3
"""Measure geometry in a reference image (pixels of the file as given).

  measure.py grid   IMG [--region x,y,w,h] [--step 50] [--zoom 2] -o out.png   labeled grid to read coordinates
  measure.py bbox   IMG --region x,y,w,h [--bg #RRGGBB] [--tol 12]            bounding box of content inside region
  measure.py radius IMG --region x,y,w,h [--bg #RRGGBB] [--tol 12]            corner radii of the shape inside region
  measure.py profile IMG --region x,y,w,h --axis y|x [--bg #RRGGBB] [--tol 12] content/gap runs (heights, gaps)
Convert to pt/dp by dividing by the device scale (e.g. 3 for a 1170px-wide iPhone screenshot).
"""
import argparse, json
import numpy as np
from PIL import Image, ImageDraw

def load(p): 
    im = Image.open(p).convert("RGBA")
    return Image.alpha_composite(Image.new("RGBA", im.size, (255, 255, 255, 255)), im).convert("RGB")

def rgn(s): return [int(float(v)) for v in s.split(",")]

def mask_of(arr, bg, tol):
    if bg is None:  # most common color on the region border
        edge = np.concatenate([arr[0], arr[-1], arr[:, 0], arr[:, -1]])
        v, c = np.unique(edge, axis=0, return_counts=True)
        bg = v[c.argmax()]
    else:
        bg = np.array([int(bg.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)])
    return (np.abs(arr.astype(int) - bg).max(axis=2) > tol), "#%02X%02X%02X" % tuple(bg)

def bbox_of(m):
    ys, xs = np.where(m)
    if len(xs) == 0: return None
    return int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)

def corner_radius(m):
    """Fit a circle to the arc: for boundary point (x, y) measured from the shape corner, r = x + y + sqrt(2xy)."""
    h, w = m.shape; res = {}
    flips = {"tl": m, "tr": m[:, ::-1], "bl": m[::-1], "br": m[::-1, ::-1]}
    for name, mm in flips.items():
        ests = []
        for y in range(min(h, w) // 2 + 1):
            row = np.where(mm[y])[0]
            if not len(row): continue
            x, yc = float(row.min()), y + 0.5
            if x >= 2 and yc >= 2: ests.append(x + yc + (2 * x * yc) ** 0.5)
        if ests: res[name] = round(float(np.median(ests)), 1)
        else: res[name] = 0.0 if np.where(mm[0])[0].min() <= 1 else None
    return res

def main():
    p = argparse.ArgumentParser(); p.add_argument("cmd", choices=["grid", "bbox", "radius", "profile"])
    p.add_argument("img"); p.add_argument("--region"); p.add_argument("--bg"); p.add_argument("--tol", type=int, default=12)
    p.add_argument("--step", type=int, default=50); p.add_argument("--zoom", type=float, default=1)
    p.add_argument("--axis", default="y"); p.add_argument("-o", "--out", default="grid.png")
    a = p.parse_args(); im = load(a.img)
    x0, y0, w, h = rgn(a.region) if a.region else (0, 0, im.width, im.height)
    crop = im.crop((x0, y0, x0 + w, y0 + h))
    if a.cmd == "grid":
        z = a.zoom; big = crop.resize((int(w * z), int(h * z)), Image.NEAREST); d = ImageDraw.Draw(big)
        for gx in range((x0 // a.step) * a.step, x0 + w + 1, a.step):
            if gx < x0: continue
            X = (gx - x0) * z; d.line([(X, 0), (X, big.height)], fill=(255, 0, 80), width=1); d.text((X + 2, 2), str(gx), fill=(255, 0, 80))
        for gy in range((y0 // a.step) * a.step, y0 + h + 1, a.step):
            if gy < y0: continue
            Y = (gy - y0) * z; d.line([(0, Y), (big.width, Y)], fill=(0, 120, 255), width=1); d.text((2, Y + 2), str(gy), fill=(0, 120, 255))
        big.save(a.out); print(f"saved {a.out} ({big.width}x{big.height}); labels are ORIGINAL pixel coordinates"); return
    m, bg = mask_of(np.asarray(crop), a.bg, a.tol)
    bb = bbox_of(m)
    if bb is None: print(json.dumps({"error": "no content found", "bg": bg})); return
    if a.cmd == "bbox":
        print(json.dumps({"bg": bg, "x": bb[0] + x0, "y": bb[1] + y0, "w": bb[2], "h": bb[3]}))
    elif a.cmd == "radius":
        sub = m[bb[1]:bb[1] + bb[3], bb[0]:bb[0] + bb[2]]
        r = corner_radius(sub)
        print(json.dumps({"bg": bg, "shape": {"x": bb[0] + x0, "y": bb[1] + y0, "w": bb[2], "h": bb[3]}, "radius_px": r,
                          "is_pill": all(v is not None and v >= min(bb[2], bb[3]) / 2 - 1 for v in r.values())}))
    else:
        proj = m.any(axis=1 if a.axis == "y" else 0); runs = []; start = 0
        for i in range(1, len(proj) + 1):
            if i == len(proj) or proj[i] != proj[start]:
                runs.append({"type": "content" if proj[start] else "gap", "from": start + (y0 if a.axis == "y" else x0), "size": i - start}); start = i
        print(json.dumps({"bg": bg, "axis": a.axis, "runs": runs}, indent=1))

if __name__ == "__main__": main()
