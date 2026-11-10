# Extraction checklist: what to capture and how to measure it

Work top to bottom. Every item is either measured with a script (`[M]`), read from the pixels by eye and cross-checked (`[I]`), or listed as unknown (`[?]`).
All script coordinates are pixels of the file as given. Divide by the device scale to get pt/dp.

## A. Canvas, device and scale
- Record file size in px. Decide the kind: single screen, multi-screen board, web page, or video (then also read `video-protocol.md`).
- On a board: find every screen with `measure.py bbox` on its frame, list their order and gaps, and record board background, frame style, aspect ratio.
- Infer device scale from the screen width in px. Common pairs (px -> pt @scale): 750 -> 375 @2x, 828 -> 414 @2x, 1125 -> 375 @3x, 1170 -> 390 @3x, 1179 -> 393 @3x,
  1206 -> 402 @3x, 1284 -> 428 @3x, 1290 -> 430 @3x, 1320 -> 440 @3x, Android 1080 -> 360 @3x. Web screenshots: 1x if the width is 1280-1920, 2x if about double.
- Measure status bar, top bar, bottom bar and home indicator heights. Record safe areas. Typical iOS: nav bar 44pt, tab bar 49pt + about 34pt home indicator.

## B. Color
- `palette.py IMG --k 14` for the global palette, then per region (`--region`) for each screen and for photos separately.
- `palette.py IMG --point x,y` for every role: page background, surface/card, elevated surface, primary text, secondary text, tertiary text/placeholder,
  primary accent, secondary accent, success/warning/error, dividers, icon fills, selected/disabled states, overlays.
- On compressed or downscaled references, re-run with `--tol 12` and treat near-identical clusters (for example #0876FD and #137FFD) as one color; report the cluster center and the spread.
- Text color: sample the interior of the thickest glyph of the biggest text in that style. Anti-aliasing makes small text read lighter than it is.
- Gradients: `palette.py IMG --line x1,y1,x2,y2 --steps 6`. Sample 2-3 differently angled lines to tell linear from radial; record angle, stops with positions, and whether it is on a fill, text, border or glow.
- Scrims over photos: sample the scrim at several heights against the same photo area unscrimmed (if visible) and record start/end alpha and direction.
- Glass/blur: compare the background sample behind the panel with the panel sample to get tint and opacity; estimate blur from how sharp background edges stay (`[I]`).
- Record light/dark mode if both appear. Compute text/background contrast for the main pairs.

## C. Typography
- Transcribe every string verbatim (vision first, `tesseract` for small text). Keep case, punctuation, emoji, numerals, units, currency.
- For each distinct style (display, title, headline, body, caption, label, button, chip, tab, number/metric): measure capital-letter height with `measure.py bbox` on one capital, then
  size ≈ cap height / ratio (Inter 0.727, SF Pro about 0.705, Roboto 0.711, Arial 0.716). Convert to pt.
- Line height: baseline-to-baseline of two lines (`measure.py profile --axis y`). Letter spacing: compare measured width of a known string with a render at 0 tracking (`[I]`).
- Weight: judge by stem thickness relative to size (Regular about 0.09 of cap height ... Bold about 0.16; `[I]`).
- Family: describe distinguishing features and give the top 3 candidates with confidence, plus a free fallback. Say plainly that exact identification is not possible from pixels alone.
- Record alignment, case transform, truncation behavior, number formatting, and any serif/italic accent text.

## D. Layout and spacing
- Page margins (left/right content edges), gutters, column count, max content width (web).
- Run `measure.py profile` down every screen and across every row to list all heights and gaps. Find the base unit (4 or 8) and write the spacing scale actually used.
- For each element record x, y, w, h in px and pt, its parent, alignment, and whether it is fixed/sticky/scrolling.
- Record section rhythm (gap between sections vs between items) and density (compact/comfortable).
- Z-order and overlaps: what floats above what (FABs, sheets, nav bars, badges).

## E. Shape and stroke
- `measure.py radius` for every component class (cards, buttons, inputs, chips, images, avatars, sheets, device frame). Report px and pt, and flag pills (radius = height/2) and circles.
- iOS "continuous corners" read slightly larger than a circular arc; note `[I]` when the shape looks like a squircle.
- Strokes/borders/dividers: width in px and pt, color, opacity, dash pattern.

## F. Depth and effects
- For each elevated element: shadow extent beyond the edge on each side (use `measure.py profile` over a thin strip leaving the edge), peak darkness vs background, and color tint.
  Estimate: y-offset ≈ (bottom extent - top extent) / 2, blur ≈ 1.6 x the smaller extent to 2 x the visible extent, opacity from the darkest shadow pixel. Mark all as `[I]` and write them in CSS `box-shadow` form.
- Inner shadows, glows, outer rings, backdrop blur, noise/grain, vignettes, glossy highlights.

## G. Imagery, illustration, 3D
- For every photo: subject, framing, aspect ratio, crop focus, corner radius, overlay, color grading, and its bbox. Save a crop to `evidence/assets/`.
- For illustration or 3D: style in words (flat, line, isometric, glossy 3D, claymorphism...), material and lighting, perspective, palette, composition, where it sits.
- Mark each asset `provided by user`, `rebuild`, or `placeholder`, and say what a stand-in must look like to keep the layout intact.
- Logos and brand marks: record position, size, and clear-space; do not redraw protected marks unless the user owns them.

## H. Icons
- Style (outline/filled/duotone/3D), stroke width (px and pt), cap/join style, size grid, container shapes, active vs inactive treatment, color.
- List every icon by meaning and location. Name a likely library (SF Symbols, Lucide, Phosphor, Material Symbols) with confidence.

## I. Components and states
For each distinct component record: anatomy, size, padding, gap between parts, radius, fill/stroke/shadow tokens, text style, icon, and every state visible
(default, selected, pressed, disabled, focus, loading, error, empty, skeleton). Cover at least: buttons, chips, inputs, search, cards, list rows, top/bottom nav, tabs,
segmented controls, toggles, sliders, progress bars/rings, avatars, badges, sheets, dialogs, toasts, charts, calendars, maps.
Do not invent states that are not visible. List them under Unknowns instead.

## J. Charts and data
Chart type, axes, gridline style, series colors, stroke width, marker shape, bar radius, label format, sample data values as read from the chart.

## K. Behavior (video or multi-frame references)
Taps, scrolls, swipes, gestures, loading sequences, state changes, and which element triggers which change. Details in `video-protocol.md`.

## L. Web specifics (if the reference is a page)
Breakpoint seen, grid, max width, sticky header, hover/focus states if shown, section backgrounds, footer structure, form styling.

## M. Completeness audit (run before delivering)
- Every visible element is in a screen breakdown. Every string is transcribed. Every distinct color on screen is explained by a token or listed as an exception.
- Every spacing value maps to the scale or is listed as an exception. Every radius maps to the radius scale.
- Unknowns and assumptions are listed with how to resolve them (ask for Figma/source files, higher resolution, font name, other states).
