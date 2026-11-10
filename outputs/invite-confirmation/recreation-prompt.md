# Recreation Prompt — Convite de 15 Anos "Arco-íris"

Two variants. Both must be used **with the reference attached**: `reference-invitation-confirm.mp4`
(or the stills in `evidence/frames/`). Words alone cannot guarantee an identical result.

---

## Variant A — image-generation prompt

Generate a 9:16 vertical (720x1280) product-showcase image of a digital 15th-birthday invitation
template for "Maria Luiza", theme "Arco-íris", in a dreamy watercolor pastel style. A static phone
mockup sits centered on a peach-to-rose gradient background with the label "TEMA" and the serif
title "Arco-íris" above it and the wordmark "Capitulo15.com" below it. The phone screen shows the
invitation cover. Match the attached reference exactly: same layout, spacing, colors, copy and
proportions; do not restyle or add elements.

PRESENTATION: canvas 720x1280 px; background vertical gradient #F9F2EB -> #EFDDD0 -> #E7CAC5 ->
#E3C2BE with two very blurred radial blobs (peach #F3D9C8 behind the phone, lilac #E9D8E4 at the
bottom). "TEMA" at y 184, 13 px, uppercase, tracking 4 px, color #7A643B, centered. "Arco-íris" at
y 225-268, 61 px high-contrast serif, color #3F2125, centered. Phone mockup 304x644 px centered at
x 208-512, y 320-964: dark charcoal body #35302F, outer radius 46 px, 1 px light rim, notch 120x22 px
with bottom radius 12 px, soft shadow. Screen 280x603 px, radius 34 px. Wordmark
"Capitulo15.com" at y 1040-1084, 44 px, "Capitulo15" #47252D and ".com" #A98A50.

## Design Style
* Dreamy, airy, editorial, watercolor pastel; a debutante invitation, not a SaaS UI.
* Light mode only; very airy (32 pt text margin, 28 pt card padding); soft floating cards.
* Radius character soft; full pills for actions and chips; no hard borders.
* NOT: dark, corporate, boxy Material, neon, dense, heavy drop shadows.

## Color Palette
* Hero wash: #CCD5E8 top -> #DBDFE5 -> #E3DBE4 -> #EAE2E7 -> #F2E4DF bottom, with pale pastel
  rainbow bands and white cloud masses.
* Card surface #FCFAFB; text #5D5561 primary, #6C6068 body, #8A8288 labels.
* CTA diagonal gradient #655365 (left) -> #7E6379 (right), label #FFFFFF.
* Champagne accents #7A643B; countdown tile #FEF8EE; hairline #C1BABC.
* Decorative 7-dot strip: #B47E8E, #C8917F, #D8C58A, #A9B49F, #9FAABB, #8C93AC, #9C8F9F.

## Typography
* Display serif Cormorant Garamond (italic for the name and the date row); geometric sans Montserrat
  for body and tracked uppercase microtype.
* Scale: hero name 64 pt italic 300; XV 30 pt with 0.18em tracking; section heading 42 pt; card and
  item titles 20 pt; venue 18 pt; body 14 pt / 1.7; address 13 pt; eyebrow 9 pt / 0.20em; date 14 pt
  italic; micro label 10 pt; CTA 16 pt; countdown 28 pt over a 9 pt "DIAS".

## Layout and Components
* Canvas 390x844 pt (390x840 visible). Text margin 32 pt; cards 348 pt wide (21 pt margins), radius
  20 pt, padding 28 pt, shadow `0 10px 30px rgba(76,50,66,0.10)`.
* CTA pill 258x64 pt, radius 999, label left and a thin arrow right.
* Section header: tracked eyebrow, serif heading, 7 pastel dots (7 pt dots, 8 pt gaps), then the card.
* Countdown tile 64x84 pt, radius 15 pt, cream #FEF8EE.
* Icons: champagne glyphs ~17 pt inside 42 pt cream circles, joined by a 1 px vertical hairline.

## Screens
### 1. Cover
Phone screen top to bottom: pale sky with a large soft rainbow arc and clouds; centered uppercase
"CONVITE DE 15 ANOS" (tracked, #8A8288); huge italic serif "Maria Luiza" (#5D5561, ink 279x45 pt);
"— XV —" with thin flanking rules; "12.11.26" tracked small; near the bottom "CONVITE PARA" tracked
and "Tia Maria e família"; a pill button "Abrir convite" (#655365 -> #7E6379) with a right arrow;
white cloud masses behind the button and at the bottom edge.

### 2. Opened invitation
Same wash, scrolled up: eyebrow, "Maria Luiza", "— XV —", "15 anos • 12.11.26", the two-line tagline
"Uma noite dourada para celebrar os 15 anos da Maria.", the tracked line
"FALTA POUCO PARA CELEBRAR", a cream tile with "41" over "DIAS", and the 7 pastel dots.

### 3. Data e local
Full-bleed pale blue-pink wash band. Left-aligned header: "MARIA LUIZA · 15 ANOS", serif
"Data e local", the 7 dots. White card: italic serif "quinta-feira, 12 de novembro de 2026" with a
pill "20:30h"; 1 px divider; gray "Endereço"; serif "Casa Pérola"; 13 pt address
"Av. Paulista, 1500 - Bela Vista, São Paulo - SP, 01310-100"; outlined pill "COPIAR ENDEREÇO";
rounded static map (293x155 pt, aspect 1.9) with a plum pin.

### 4. Momentos da festa
Full-bleed wash band. Header "MARIA LUIZA · 15 ANOS", serif "Momentos da festa", 7 dots. White
card titled "Programação da festa" with a timeline: cream circle icons and serif titles
"Recepção", "Entrada da debutante", "Valsa", "Jantar", each with the exact descriptions in the
spec, joined by a thin vertical line.

## Direction
Delicate, calm, celebratory; low contrast, soft depth, huge serif type inside generous margins.
Match the attached reference exactly: same layout, spacing, colors, copy and proportions; do not
restyle or add elements. Keep the watercolor rainbow and clouds, the 32 pt text margin, the 348 pt
cards and the pale 7-dot strip.

---

## Variant B — build brief for code (HTML/CSS)

Build the four states above as one responsive mobile page (390x844 pt) plus the 720x1280 promo
frame that hosts it inside a phone mockup. Use these tokens (`tokens.json`): colors
#CCD5E8/#E3DBE4/#F2E4DF/#FCFAFB/#5D5561/#6C6068/#8A8288/#655365/#7E6379/#7A643B/#FEF8EE; radius
20 card, 15 countdown, 12 map, 999 pills; space 4/8/12/16/20/24/28/32/40/48; text margin 32; card
width 348 with 21 pt margins and 28 pt padding; shadow `0 10px 30px rgba(76,50,66,0.10)`.

Type: Cormorant Garamond (300 italic name 64 pt, heading 42 pt, card title 20 pt, venue 18 pt, date
14 pt italic) and Montserrat (body 14/1.7, address 13/1.45, eyebrow 9 with 0.20em tracking, micro 10
with 0.16em, CTA 16). Assets: A1-A3 rebuild as layered CSS gradients/SVG (rainbow arc + cloud blobs +
sparkles); A4 map placeholder (do not redraw); A5 glyph icons; A6 phone mockup in CSS; A7 wordmark as
text. Exact copy is in `design-spec.md` section 9 — transcribe it verbatim.

Per screen, use the x/y/w/h in `design-spec.md` section 9 as the layout contract. The page is a
single vertical scroll: hero, details, data, momentos, with full-bleed wash bands between sections.

Motion: the cover -> details state is a fade through white (~600 ms, ease-in-out) on open; the page
then scrolls normally (~280-360 pt/s in the reference is the recording speed, not a required
animation). No idle animation.

Acceptance: render the promo at 720x1280 and the page at 390x844, scale the page to 280x603 and
compare with `evidence/frames/0.00s.png` / `evidence/crops/cover.png` using
`compare.py REF COPY --out work/cmp`; target SSIM >= 0.97 and MAE <= 3 for the flat UI areas, and
inspect the map/illustration by eye. Fix the worst grid cells first. Attach the reference when the
generator accepts images; words alone cannot guarantee an identical result.
