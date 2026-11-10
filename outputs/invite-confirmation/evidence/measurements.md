# Measurements — `reference-invitation-confirm.mp4`

Raw outputs behind every `[M]` value in `design-spec.md` and `tokens.json`. Commands were run from the
repo root with the skill scripts:

```bash
uv run --with pillow --with numpy python .agents/skills/design-reference-replicator/scripts/<script>.py ...
```

`tesseract` is not installed on this machine, so there is **no OCR cross-check**. All copy in the spec
was transcribed by eye from `evidence/crops/*@3x` and the zoom crops; a second reader is recommended
before production.

## 1. Probe

```
ffprobe: 720x1280, 30 fps, 10.0 s, h264, 300 frames (33.33 ms/frame)
scene detection: no cuts (0.0 s, 9.9 s only) — the clip is one continuous shot
```

Frames: `--every 0.2` -> 50 frames (0.00-9.80 s), `work/frames/uniform/`. The extractor crashes at the
end trying to write `10.00s.png` (float accumulation); frames and sheets 1-4 are complete, sheet 5 is
not produced.

## 2. Screen bounds (the phone screen is static in every frame)

`measure.py profile` on the video frames, background `#35302F` (phone body), `tol 24`:

| frame | screen x | screen y |
|---|---|---|
| 0.00 s | 220-499 | 332-934 |
| 3.60 s | 220-499 | 332-934 |
| 5.60 s | 220-499 | 332-934 |
| 6.60 s | 220-499 | 333-934 |
| 8.00 s | 220-499 | 333-933 |
| 9.20 s | 220-499 | 333-934 |

=> **screen crop = (220,332) 280x603 px**, used for every crop in `evidence/crops/`.

Conversion used throughout: `pt = px / 0.718` (280 px = 390 pt). Every pt value in the spec is a
projection onto that assumed canvas `[I]`.

## 3. Palette

Full frame, `palette.py --k 10`:

```
#E7CAC5 23.85%   #F9F2EB 20.17%   #EFDDD0 16.61%   #F4E7DD 16.35%
#EAE2E7  6.78%   #E9D3C9  4.55%   #E0D9E7  2.34%   #CCD5E8  1.23%
#E2C1BD  0.88%   #363435  0.83%
```

Point probes (`palette.py --r 0`, exact pixel):

| xy (frame) | hex | element |
|---|---|---|
| 10,10 | #FAF3EC | outer background top |
| 360,980 | #E8D0C5 | outer background lower |
| 10,1270 | #E3C2BE | outer background bottom corner |
| 360,190 | #B1997C* | "TEMA" glyph edge |
| 226,338 | #4A464D* | phone notch |
| 360,600 | #E6E0E9 | screen background (lilac) |

`*` = antialiased sample, not a fill color.

Screen crop, region `0,0,283,180` (`palette.py --region`): `#E8E6E7` 22.7%, `#DBDFE5` 18.2%,
`#CCD5E8` 17.4%, `#D4D7E6` 13.2% — the hero sky gradient.

Card interior probes (data card, flat `#FCFAFB`): `#FBFBFB` / `#FCFAFB` dominate every text region;
text cores were taken as the median of pixels with luminance < 0.42:

```
data heading   #605661    cover name  #5D5561    card address #5B595A
countdown 41   #6A635A    prog body   #696669
```

CTA fill probes across the button (`cover.png`, y=446): x=48 `#655365`, x=60 `#6B526D`, x=140
`#735A75`, x=225 `#7E6379`; at x=140, y=464 `#6B5264`. => diagonal gradient, lighter to the right.

Countdown tile probe: interior `#FEF8EE`, left edge ~x=117, right ~x=162.

## 4. Text line map (row profile)

Method: for each crop, count pixels with luminance < 0.60 per row across x 8-272, group consecutive
rows with >2 such pixels, and report the run plus its x extent. This is the most reliable measurement
in the kit: it is insensitive to background gradients for dark text.

### 4.1 Cover (`crops/cover.png`, 0.00 s)

| y px | h | x px | w | pt y | pt x | reading |
|---|---|---|---|---|---|---|
| 216-247 | 32 | 41-239 | 199 | 301-344 | 57-333 | "Maria Luiza" |
| 315-319 | 5 | 120-157 | 38 | 439-444 | 167-219 | "12.11.26" (light, partial) |
| 381-384 | 4 | 110-167 | 58 | 531-535 | 153-233 | "CONVITE PARA" (partial) |
| 394-402 | 9 | 96-183 | 88 | 549-560 | 134-255 | "Tia Maria e família" |
| 425-465 | 41 | 47-231 | 185 | 592-648 | 65-322 | CTA fill |
| 596-602 | 7 | 8-271 | 264 | 830-839 | — | bottom rounded corners |

Eyebrow ("CONVITE DE 15 ANOS") is too light for the 0.60 threshold; a 0.62 run gives ink at
y 146-151 px (203-210 pt), x 88-188 px (123-262 pt). Height is clipped by the threshold, so the size
comes from the width and from the 0.70 cap-height assumption.

### 4.2 Details (`crops/details.png`, 3.60 s)

| y px | h | x px | w | pt y | pt x | reading |
|---|---|---|---|---|---|---|
| 73-80 | 8 | 60-218 | 159 | 102-111 | 84-304 | eyebrow (partial) |
| 111-138 | 28 | 51-227 | 177 | 155-192 | 71-316 | "Maria Luiza" (still settling) |
| 190-194 | 5 | 92-185 | 94 | 265-270 | 128-258 | "15 anos • 12.11.26" |
| 210-217 | 8 | 46-234 | 189 | 293-302 | 64-326 | tagline line 1 |
| 230-235 | 6 | 104-171 | 68 | 320-327 | 145-238 | tagline line 2 ("anos da Maria.") |
| 335-340 | 6 | 61-215 | 155 | 467-474 | 85-299 | "FALTA POUCO PARA CELEBRAR" |
| 367-379 | 13 | 133-148 | 16 | 511-528 | 185-206 | "41" |
| 392-396 | 5 | 131-148 | 18 | 546-552 | 182-206 | "DIAS" |
| 549-569 | 21 | 24-133 | 110 | 765-793 | 33-185 | "Data e local" entering |

### 4.3 Details, settled scroll (`crops/details48.png`, 4.80 s)

| y px | pt y | x px | reading |
|---|---|---|---|
| 83-88 | 116-123 | 92-185 | "15 anos • 12.11.26" |
| 104-111 | 145-155 | 46-234 | tagline line 1 |
| 125-129 | 174-180 | 104-171 | tagline line 2 |
| 229-233 | 319-325 | 61-216 | "FALTA POUCO PARA CELEBRAR" |
| 260-273 | 362-380 | 133-148 | "41" |
| 286-290 | 398-404 | 131-148 | "DIAS" |
| 422-426 | 588-593 | 22-114 | next section eyebrow |
| 443-462 | 617-644 | 24-133 | "Data e local" |

### 4.4 Data e local (`crops/data.png`, 5.60 s)

| y px | h | x px | w | pt y | pt x | reading |
|---|---|---|---|---|---|---|
| 99-104 | 6 | 61-215 | 155 | 138-145 | 85-299 | "FALTA POUCO..." leaving |
| 131-143 | 13 | 133-148 | 16 | 182-199 | 185-206 | "41" |
| 157-160 | 4 | 131-148 | 18 | 219-223 | 182-206 | "DIAS" |
| 293-295 | 3 | 22-104 | 83 | 408-411 | 31-145 | eyebrow (partial) |
| 313-333 | 21 | 24-133 | 110 | 436-464 | 33-185 | "Data e local" |
| 408-411 | 4 | 175-200 | 26 | 568-572 | 244-279 | "20:30h" |
| 435-440 | 6 | 31-75 | 45 | 606-613 | 43-104 | "Endereço" |
| 456-463 | 8 | 31-87 | 57 | 635-645 | 43-121 | "Casa Pérola" |
| 483-491 | 9 | 31-178 | 148 | 673-684 | 43-248 | address line 1 |
| 501-509 | 9 | 31-160 | 130 | 698-709 | 43-223 | address line 2 |
| 527-531 | 5 | 38-122 | 85 | 734-740 | 53-170 | "COPIAR ENDEREÇO" |
| 553-592 | — | 37-246 | — | 770-825 | — | map raster (labels/roads) |

Card edges at y=450 px: background `#EFE7EC` up to x=14, `#F8F3F5` at 15, `#FCFCFB` from 16;
right side white to x=263, `#F1EBF0` at 264. => card x 15-264 px (250 px = 348 pt), left margin
21 pt, right margin 22 pt.

### 4.5 Map state (`crops/map.png`, 6.60 s)

| y px | pt y | x px | reading |
|---|---|---|---|
| 131-134 | 182-187 | 22-114 | eyebrow |
| 152-171 | 212-238 | 24-133 | "Data e local" |
| 246-249 | 343-347 | 175-200 | "20:30h" |
| 274-278 | 382-387 | 31-75 | "Endereço" |
| 295-302 | 411-421 | 31-87 | "Casa Pérola" |
| 322-330 | 449-460 | 31-178 | address line 1 |
| 340-347 | 474-483 | 31-160 | address line 2 |
| 365-369 | 508-514 | 38-122 | "COPIAR ENDEREÇO" |
| 391-468 | 545-652 | 36-241 | map raster |

Card vertical extent at x=150 px: 223-520 px => **card 223-520 px = 414 pt tall** (top 310 pt).
Map starts 389 px (542 pt); card bottom padding 20 px => map ends ~500 px (696 pt), height 111 px
= 155 pt; width 210 px (293 pt) after 28 pt card padding. Aspect ≈ 1.9.

### 4.6 Momentos (`crops/programacao.png`, 9.20 s)

| y px | h | x px | w | pt y | pt x | reading |
|---|---|---|---|---|---|---|
| 187-189 | 3 | 22-104 | 83 | 260-263 | 31-145 | eyebrow (partial) |
| 207-227 | 21 | 24-207 | 184 | 288-316 | 33-288 | "Momentos da festa" |
| 304-308 | 5 | 32-151 | 120 | 423-429 | 45-210 | "Programação da festa" |
| 339-344 | 6 | 71-129 | 59 | 472-479 | 99-180 | "Recepção" |
| 360-367 | 8 | 44-212 | 169 | 501-511 | 61-295 | body 1 line 1 |
| 379-383 | 5 | 70-187 | 118 | 528-533 | 98-260 | body 1 line 2 |
| 397-402 | 6 | 70-137 | 68 | 553-560 | 98-191 | body 1 line 3 |
| 424-435 | 12 | 71-205 | 135 | 591-606 | 99-286 | "Entrada da debutante" |
| 447-458 | 12 | 41-231 | 191 | 623-638 | 57-322 | body 2 line 1 |
| 467-473 | 7 | 70-227 | 158 | 650-659 | 98-316 | body 2 line 2 |
| 487-492 | 6 | 70-155 | 86 | 678-685 | 98-216 | body 2 line 3 |
| 520-524 | 5 | 73-100 | 28 | 724-730 | 102-139 | "Valsa" |
| 536-545 | 10 | 42-239 | 198 | 747-759 | 59-333 | body 3 line 1 |
| 556-563 | 8 | 70-194 | 125 | 774-784 | 98-270 | body 3 line 2 |
| 591-602 | 12 | 8-271 | 264 | 823-839 | — | bottom corners |

Icon circle: cream mask (`#F6E9E2`, tol 12) over the first item gives bbox (32,355,28,25) px => circle
~30 px = 42 pt, centred at x 46 px (64 pt), y 367 px (511 pt).

### 4.7 Dots

Point probes on the strip at y=356 px: x=20 `#F1E6EC`, x=31 `#F6E6EA`, x=42 `#ECE5E4`, x=53
`#EFE7F2`, x=64 `#EFE7F2`, x=75 `#EDE5F0`, x=86 `#EDE5EC`. Pitch = 11 px (15 pt); dot ~5 px (7 pt),
gap ~6 px (8 pt). Colors are heavily antialiased at 5 px, so the seven hex values in the spec are
`[I]` approximations of the pastel sequence, not exact fills.

## 5. Type size derivation (all `[I]`)

Rule: `size ≈ ink_height_px / 0.718 / 0.70` for cap-height-only ink (serif cap height ≈ 0.70 em), or
`ink_height / 0.718 / 1.0` when the string has both ascenders and descenders. Widths were used as a
cross-check with `chars × 0.5 em` (sans) / `0.42 em` (serif).

| Element | ink h px | pt h | derived size | cross-check |
|---|---|---|---|---|
| Hero name | 32 | 45 | 64 | width 279 pt / "Maria Luiza" |
| Section heading | 21 | 29 | 42 | width 153 pt / "Data e local" |
| Card title | 15 (with ç/g) | 21 | 20 | width 167 pt / "Programação da festa" |
| Venue | 9 | 13 | 18 | width 74 pt / "Casa Pérola" |
| Body | 8 per line | 11 | 14 | 3 lines in 199 pt column; pitch 19 px = 1.7 line-height |
| Address | 9-10 | 13-14 | 13 | 32 chars in 206 pt |
| Eyebrow | 4-5 (clipped) | 6-7 | 9 | 21 chars in ~135 pt with 0.20em tracking |
| Date | 10 (with asc/desc) | 14 | 14 | 35 chars in ~185 pt italic |
| Countdown number | 14 | 19.5 | 28 | "41" width 22 pt |
| Countdown label | 5 | 7 | 9 | 4 chars in 25 pt |
| CTA label | 12 | 17 | 16 | white core only |

Expected error ±15%; hierarchy is more reliable than absolute values. If the real CSS is available,
replace this table with the computed values.

## 6. Known measurement limits

1. `tesseract` missing -> no OCR; copy transcribed by eye.
2. Small low-contrast text on the illustrated wash (cover eyebrow/date, section eyebrows, "XV") cannot
   be thresholded cleanly; those widths/heights are partial and their sizes are `[I]`.
3. `measure.py radius` cannot fit the soft low-contrast card corners (returns region-sized values);
   radii in the spec are visual estimates.
4. `measure.py bbox` with `--bg/--tol` is unreliable over gradients (it catches the rainbow bands);
   only bboxes on flat white card surfaces were kept as `[M]`.
5. The map is a raster asset; its internal labels were not transcribed.
6. The clip ends mid-list ("Jantar" clipped), so the rest of the page is unknown.
