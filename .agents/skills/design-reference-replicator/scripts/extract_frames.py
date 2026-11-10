#!/usr/bin/env python3
"""Prepare a reference video for analysis.

  extract_frames.py VIDEO --out DIR [--scene 0.2] [--every SEC] [--max 60]
  extract_frames.py VIDEO --out DIR --window START END [--fps 30]     dense frames to time a transition
Writes metadata.json, scene/ and uniform/ frames, contact_sheet_*.png (labeled with timestamps),
or dense/ frames named by millisecond. Needs ffmpeg + ffprobe.
"""
import argparse, json, os, re, subprocess
from PIL import Image, ImageDraw

def sh(cmd): return subprocess.run(cmd, capture_output=True, text=True)

def probe(path):
    r = json.loads(sh(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=width,height,r_frame_rate,nb_frames,duration,codec_name:format=duration", "-of", "json", path]).stdout)
    s = r["streams"][0]; num, den = [float(v) for v in s["r_frame_rate"].split("/")]
    dur = float(s.get("duration") or r["format"]["duration"])
    return {"width": s["width"], "height": s["height"], "fps": round(num / den, 3), "duration_s": round(dur, 3),
            "frames": s.get("nb_frames"), "codec": s["codec_name"], "ms_per_frame": round(1000 * den / num, 2)}

def grab(path, t, dest):
    sh(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", path, "-frames:v", "1", dest])

def scene_times(path, thr):
    r = sh(["ffmpeg", "-v", "info", "-i", path, "-vf", f"select='gt(scene,{thr})',showinfo", "-f", "null", "-"])
    return [float(m) for m in re.findall(r"pts_time:([0-9.]+)", r.stderr)]

def sheet(frames, out_prefix, cols=4, thumb=360):
    for n in range(0, len(frames), 12):
        chunk = frames[n:n + 12]; rows = (len(chunk) + cols - 1) // cols
        ims = [(Image.open(f).convert("RGB"), t) for f, t in chunk]
        th = int(thumb * ims[0][0].height / ims[0][0].width)
        S = Image.new("RGB", (cols * thumb, rows * (th + 18)), (20, 20, 20)); d = ImageDraw.Draw(S)
        for i, (im, t) in enumerate(ims):
            x, y = (i % cols) * thumb, (i // cols) * (th + 18)
            S.paste(im.resize((thumb, th)), (x, y + 18)); d.text((x + 4, y + 3), f"t={t:.2f}s", fill=(255, 255, 255))
        S.save(f"{out_prefix}_{n // 12 + 1}.png")

def main():
    p = argparse.ArgumentParser(); p.add_argument("video"); p.add_argument("--out", required=True)
    p.add_argument("--scene", type=float, default=0.2); p.add_argument("--every", type=float)
    p.add_argument("--max", type=int, default=60); p.add_argument("--window", nargs=2, type=float)
    p.add_argument("--fps", type=float, default=30); a = p.parse_args(); os.makedirs(a.out, exist_ok=True)
    meta = probe(a.video)
    if a.window:
        d = os.path.join(a.out, "dense"); os.makedirs(d, exist_ok=True)
        s, e = a.window; n = min(int((e - s) * a.fps) + 1, 300); frames = []
        for i in range(n):
            t = s + i / a.fps; dest = os.path.join(d, f"{int(round(t * 1000)):07d}ms.png"); grab(a.video, t, dest); frames.append((dest, t))
        sheet(frames, os.path.join(a.out, "dense_sheet")); meta["dense"] = {"window": a.window, "fps": a.fps, "count": n}
    else:
        os.makedirs(os.path.join(a.out, "scene"), exist_ok=True); os.makedirs(os.path.join(a.out, "uniform"), exist_ok=True)
        ts = scene_times(a.video, a.scene)
        if len(ts) > a.max: ts = ts[::max(1, len(ts) // a.max)][:a.max]
        ts = sorted(set([0.0] + ts + [max(0, meta["duration_s"] - 0.1)])); frames = []
        for i, t in enumerate(ts):
            dest = os.path.join(a.out, "scene", f"{i:03d}_{t:.2f}s.png"); grab(a.video, t, dest); frames.append((dest, t))
        step = a.every or max(0.25, meta["duration_s"] / 24); t = 0.0; uni = []
        while t < meta["duration_s"]:
            dest = os.path.join(a.out, "uniform", f"{t:.2f}s.png"); grab(a.video, t, dest); uni.append((dest, t)); t += step
        sheet(frames, os.path.join(a.out, "scene_sheet")); sheet(uni, os.path.join(a.out, "uniform_sheet"))
        meta["scene_times_s"] = [round(t, 2) for t in ts]; meta["uniform_step_s"] = round(step, 2)
    json.dump(meta, open(os.path.join(a.out, "metadata.json"), "w"), indent=1); print(json.dumps(meta, indent=1))

if __name__ == "__main__": main()
