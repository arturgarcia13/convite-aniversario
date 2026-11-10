# AGENTS.md

## What this directory is

A design-replication workspace, not an application: no package manifest, build, tests, lint, CI, or
git. Two inputs and one skill:

- `.agents/skills/design-reference-replicator/` — the skill: `SKILL.md`, `scripts/`, `references/`. `SKILL.md`
  resolves `scripts/` and `references/` relative to itself, so run commands from that folder or pass
  the full path (see below).
- `reference-invitation-confirm.mp4` — the reference to replicate.
- `*:Zone.Identifier` — Windows download markers (`ZoneId=3`), not content. Ignore them.

Do not scaffold a toolchain or invent `npm test`-style commands unless the user asks.

## Environment setup (do not run these scripts with bare `python3`)

System `python3` is 3.14 with no `pip`, no `Pillow`, no `scikit-image`; every script imports
`PIL` + `numpy`, so they fail immediately. `uv` is installed — use an ephemeral environment:

```bash
uv run --with pillow --with numpy python .agents/skills/design-reference-replicator/scripts/<script>.py ...
```

Add `--with scikit-image` for `compare.py`: without it SSIM reports `null` and `pass` is always
false (MAE and the heatmap still work). `ffmpeg`/`ffprobe` are present. `tesseract` is **not**, so
the OCR cross-check in the extraction checklist is unavailable — transcribe by eye and say so.

## Commands (verified on this repo's video)

```bash
uv run --with pillow --with numpy python .agents/skills/design-reference-replicator/scripts/extract_frames.py \
  reference-invitation-confirm.mp4 --out work/frames

uv run --with pillow --with numpy python .agents/skills/design-reference-replicator/scripts/palette.py IMG --k 14
uv run --with pillow --with numpy python .agents/skills/design-reference-replicator/scripts/measure.py bbox IMG --region x,y,w,h
uv run --with pillow --with numpy python .agents/skills/design-reference-replicator/scripts/compare.py REF COPY --out work/cmp
```

All coordinates are pixels of the file as given; divide by the inferred device scale for pt/dp.
`compare.py` fills a perfect `pass` only at SSIM >= 0.97 and MAE <= 3 on flat UI.

## The reference video: what the numbers do not tell you

`ffprobe`: 720x1280, 30 fps, 10.0 s, h264, 300 frames (33.33 ms/frame). Two consequences:

- Scene-change extraction finds **no cuts** (only `0.0` and `9.9` s) — the whole clip is one
  continuous composition. Extract with `--every 0.2` (or `--window`) instead of relying on `scene/`.
- 720 px width is **not** in the checklist's device-scale table (750/828/1125/1170...). Infer the
  scale and mark it `[I]`; do not silently treat 720 as 1x.

The clip has two visual layers: an outer promo/mockup composition (beige background, "TEMA /
Arco-íris" label, phone frame, `Capitulo15.com` footer, mouse cursor) and the actual mobile UI inside
the phone (invitation cover, "Convite de 15 anos / Maria Luiza", RSVP modal, calendar, date/time and
location sections). Decide which layer is the deliverable and crop the phone screen before measuring;
mixing coordinates from both layers produces meaningless specs.

## Adapt the skill to this machine

- `SKILL.md` writes to `/mnt/user-data/outputs/<slug>/` and calls a `present_files` tool. Neither
  exists here. Write the kit to `outputs/<slug>/` in this repo (`design-spec.md`, `tokens.json`,
  `recreation-prompt.md`, `evidence/`) and keep intermediates in `work/`.
- Deliverable files are written in English; converse with the user in their own language.
- Follow the skill's core discipline: measure with the scripts instead of eyeballing, tag every
  value `[M]` measured / `[I]` inferred / `[?]` unknown, never present an inference as measured, and
  transcribe visible text verbatim.
