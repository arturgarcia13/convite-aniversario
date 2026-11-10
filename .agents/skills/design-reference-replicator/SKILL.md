---
name: design-reference-replicator
description: Turns a reference design (screenshot, mockup, UI shot, multi-screen board, website or app screen recording, motion video) into a complete replication kit - a measured design spec, design tokens, and a paste-ready recreation prompt in the user's Design Prompts format - so an identical copy can be built. Use this whenever the user shares an image or video of a design and wants to copy, clone, replicate, recreate, match, reverse-engineer or "make it identical", or wants the style, colors, fonts, spacing, components, screens, animations or design system extracted, or wants a prompt that reproduces it. Trigger even if they only say "faz igual a essa referência", "make this", "extract the design" or "turn this into a prompt".
---

# Design Reference Replicator

Take a visual reference and extract everything needed to rebuild it identically: measured colors, typography, spacing, shape, depth, imagery, icons, components,
every screen with its exact copy, and (for video) timed motion. The deliverable follows the structure of the user's Design Prompts template
(Design Style, Color Palette, Typography, Screens, Direction, plus Presentation / 3D Assets / Icons), extended with measured numbers so the result is reproducible.

Scripts and references live next to this file. Resolve `scripts/` and `references/` from the folder this SKILL.md was read from.

## Rules that decide the quality
- **Measure, do not eyeball.** Hex values come from `scripts/palette.py`, sizes and radii from `scripts/measure.py`, timing from frame counts. Eyeballed hex is the usual reason a copy is "close but not identical".
- **Tag every value**: `[M]` measured from pixels, `[I]` inferred (fonts, shadow blur, easing), `[?]` unknown. Never present an inferred value as measured.
- **Cover everything visible.** A missed element is the most common reason a copy is not identical. Inventory first, describe second.
- **Transcribe all text verbatim** (case, punctuation, numbers, emoji). Use `tesseract` to double-check small text.
- **Do not invent.** Record only states, screens and behaviors that are visible. List the rest under Unknowns with how to resolve them.
- **Be honest about limits.** Pixels cannot prove a font family, a hidden state or an exact shadow. Give top candidates with confidence. Photos, illustrations and logos are assets: inventory them with a crop and mark them `provided by user`, `rebuild` or `placeholder`. Do not redraw protected brand marks.
- **Units**: measure in px, report px and pt/dp after inferring the device scale (`references/extraction-checklist.md`, section A).
- Write the files in English (the template prompts and image generators use it). Talk to the user in their language.

## Workflow

### 1. Intake
List the uploaded files and open each one. Decide the kind: single screen, multi-screen board, web page, or video. If several files are given, treat them as one design system only if they clearly are one; flag token conflicts.
Ask a question only if something blocks the work (for example a corrupted file). The default output is the full kit: spec, tokens, and both prompt variants.
If the image is small or compressed, say so: measurements carry about plus or minus 1-2 px and colors on JPEG edges may drift.

### 2. Inventory before measuring
Write a flat list of every screen, region and element you can see, in reading order, with rough locations. This list becomes the coverage audit.
For a board, find each screen's frame with `python scripts/measure.py bbox IMG --region x,y,w,h` and crop each to `work/screens/`.
Use `python scripts/measure.py grid IMG --step 100 --zoom 2 -o work/grid.png` to read coordinates on large images, and crop plus zoom to inspect small details.

### 3. Video only
Follow `references/video-protocol.md`: run `scripts/extract_frames.py`, view the contact sheets, pick one clean frame per screen for static analysis, then time every transition from dense frame windows.
Output a timeline and per-transition specs (property, from, to, duration, delay, easing).

### 4. Extract design tokens
Follow `references/extraction-checklist.md` sections A to H:
- Colors: `scripts/palette.py IMG --k 14`, then `--point` for each role and `--line` for gradients.
- Typography: transcribe text, measure cap heights, derive size, weight, line height, tracking, and list family candidates.
- Layout: `scripts/measure.py profile` down and across to get heights and gaps, then find the base unit and the spacing scale.
- Shape: `scripts/measure.py radius` for each component class. Depth: shadow extents, offsets and opacity in CSS form. Icons and imagery as in the checklist.

### 5. Break down components and screens
Per `references/extraction-checklist.md` sections I to L. Describe each distinct component once (anatomy, size, padding, tokens, visible states),
then each screen with a layout tree (x, y, w, h in pt), the components used, exact copy, assets and visible states.

### 6. Assemble the kit
Use `references/output-template.md` exactly. Write to `/mnt/user-data/outputs/<slug>/`:
1. `design-spec.md`: the full spec (13 sections)
2. `tokens.json`: machine-readable tokens, each leaf tagged
3. `recreation-prompt.md`: Variant A (image-generation prompt in the Design Prompts format) and Variant B (build brief for code)
4. `evidence/`: the frames, crops, contact sheets and grid overlays your numbers came from

### 7. Audit before delivering
Run the completeness audit (checklist section M). Reconcile every on-screen color with a token, every gap with the spacing scale, every radius with the radius scale; list exceptions.
Re-open the reference and walk the inventory from step 2: each item must appear in the spec. Fix gaps, then present the files with `present_files`.

### 8. Close the loop (when a copy exists or the user asks you to build it)
Render the copy at the same pixel size as the reference and run `python scripts/compare.py REF COPY --out work/cmp`.
It reports MAE, SSIM, the worst grid cells, and the palette delta, and writes a heatmap and a side-by-side image.
Fix the worst cells first, using the spec to find which token or measurement was off, then re-run. Target for flat UI: SSIM at least 0.97 and MAE at most 3. Photos and 3D will score lower, so judge those by eye.
Save the final numbers in `fidelity-report.md`.

## Final reply to the user
Keep it short: what was captured (screens, components, tokens, motion), where the files are, overall confidence, the top unknowns with how to resolve them
(for example: the original font name, a higher-resolution file, the source Figma, other states), and the next step (generate or build, then run the comparison).
A text prompt alone cannot guarantee an identical image, so recommend attaching the reference when the generator accepts images.
