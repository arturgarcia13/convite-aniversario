# Convite de 15 Anos — "Arco-íris" Design Spec

Source: `reference-invitation-confirm.mp4` (720x1280, 30 fps, 10.0 s, h264) | Kind: video (vertical promo
composition containing a mobile page) | Canvas: 720x1280 px outer, phone screen 280x603 px |
Device scale: preview of a 390 pt-wide screen at 0.718 px/pt [I] -> 390x840 pt visible (390x844 design) |
Extraction confidence: high for layout/color on flat surfaces, medium for type sizes (±15%), low for
the moving illustration and the map.

Two layers are documented separately: the **outer promo composition** (marketing mockup from
Capitulo15.com) and the **invitation page** inside the phone. The product UI is the invitation page;
the outer layer is framing.

**How to read the numbers.** Every `px` value is a pixel of the 280x603 screen crop taken at
`(220,332)` in the video frame. Every `pt` value is `px / 0.718`, i.e. the same measurement projected
onto an assumed 390 pt-wide design canvas [I]. `[M]` = measured with the scripts in
`.agents/skills/design-reference-replicator/scripts/` (outputs in `evidence/measurements.md`), `[I]` =
inferred, `[?]` = unknown.

## 1. What the reference shows

A 15th-birthday ("15 anos") digital invitation template named **Arco-íris** (rainbow), sold on
**Capitulo15.com**. The clip is a vertical product preview: a static phone mockup on a peach-to-rose
gradient with the theme name, then the invitation page inside the phone opens and scrolls from the
cover to the event details.

The product helps guests:
* identify the invitation and the guest it was addressed to ("Tia Maria e família")
* open the invitation
* see the countdown to the party
* read the date, address and copy it
* see the venue on a map
* read the party programme (reception, debutante entrance, waltz, dinner)

The page is a single vertical scroll: hero -> details -> date/venue -> programme. No navigation bar,
no menu, no RSVP flow is visible.

## 2. Design Style

* Romantic, airy, editorial, watercolor pastel; a quinceañera / debutante aesthetic rather than a
  SaaS or corporate one.
* Mode: light only; density: very airy (32 pt text margin, generous 28 pt card padding); feel:
  delicate, calm, celebratory.
* Radius character: soft (cards 20 pt, map 12 pt) plus full pills for actions and chips.
* Depth: floating — white cards over an illustrated wash with wide, very soft plum shadows; no hard
  borders except 1 px hairlines.
* Type pairing: a high-contrast display serif (roman + italic) against a geometric sans in wide
  letter-spaced capitals.
* NOT: high-contrast dark UI, boxy Material, neon, drop-shadow-heavy skeuomorphism, dense data.

## 3. Color Palette

Invitation page:

| Role | Hex | Usage | Tag |
|---|---|---|---|
| Sky top | #CCD5E8 | top of hero wash, behind the rainbow | [M] |
| Sky mid | #DBDFE5 | upper-middle of hero | [M] |
| Lilac | #E3DBE4 | hero/body background, sections | [M] |
| Lilac light | #EAE2E7 | lower hero, behind type | [M] |
| Cream | #F2E4DF | bottom of hero, cloud base | [M] |
| Cloud white | #FDF8F7 | cloud shapes, highlight | [M] |
| Card surface | #FCFAFB | cards, sheet | [M] |
| Text primary | #5D5561 | name, headings, item titles | [M] |
| Text secondary | #6C6068 | body copy | [M] |
| Text tertiary | #8A8288 | eyebrow, labels, "Endereço" | [I] |
| Text faint | #959595 | date row on white, faint labels | [I] |
| CTA fill left | #655365 | "Abrir convite" fill, left edge | [M] |
| CTA fill right | #7E6379 | same fill, right edge (diagonal gradient) | [M] |
| CTA mid | #6E5470 | gradient midpoint, for a flat fallback | [I] |
| CTA label | #FFFFFF | button text | [M] |
| Accent champagne | #7A643B | "TEMA", icon glyphs, chip borders | [M] |
| Countdown fill | #FEF8EE | countdown tile | [M] |
| Hairline | #C1BABC | "COPIAR ENDEREÇO" 1 px pill border | [M] |

Outer promo composition:

| Role | Hex | Usage | Tag |
|---|---|---|---|
| Background top | #F9F2EB | top gradient stop | [M] |
| Background peach | #EFDDD0 | mid gradient / blurred blob | [M] |
| Background rose | #E7CAC5 | lower half | [M] |
| Background edge | #E3C2BE | bottom corners | [M] |
| Theme label | #7A643B | "TEMA" | [M] |
| Theme title | #3F2125 | "Arco-íris" serif | [M] |
| Wordmark | #47252D | "Capitulo15" | [M] |
| Wordmark accent | #A98A50 | ".com" (approximate, antialiased) | [I] |
| Phone frame | #35302F | mockup body, notch | [M] |

Gradients:
* Hero wash: vertical #CCD5E8 0% -> #DBDFE5 -> #E3DBE4 -> #EAE2E7 -> #F2E4DF 100%, with a pale
  rainbow arc and white cloud masses composited on top [M].
* Outer background: vertical #F9F2EB 0% -> #EFDDD0 45% -> #E7CAC5 75% -> #E3C2BE 100%, plus two
  blurred radial blobs (peach #F3D9C8 behind the phone, lilac #E9D8E4 at the bottom) [I].
* CTA: diagonal, #655365 at the left -> #7E6379 at the right, slightly darker at the bottom [M]
  (probe points: x=48 #655365, x=140 #735A75, x=225 #7E6379; y=464 #6B5264).

Overlays/scrims: none visible. Glass: none. Dark mode: not shown. Contrast: primary on lilac
#5D5561/#E3DBE4 ≈ 6.1:1; white on CTA #FFFFFF/#655365 ≈ 8.1:1 (both [I] computed).

## 4. Typography

Family: display serif **Cormorant Garamond** (alternatives: Playfair Display, EB Garamond;
confidence medium-high — the italic `a`, `q` and `f` shapes match). Sans **Montserrat**
(alternatives: Jost, DM Sans; confidence medium-low). Fallbacks: Georgia, Inter/system-ui. Exact
identification from pixels is not possible.

Sizes below are `[I]`, derived from measured ink heights (cap height ≈ 0.70 em for the serif) and
string widths, rounded to the nearest point; expect ±15%. The hierarchy is the reliable part:
64 / 42 / 20 / 14 / 9.

| Style | Size pt | Weight | Line height | Tracking | Color | Case | Where used |
|---|---|---|---|---|---|---|---|
| Hero name | 64 | 300 italic | 1.0 | 0 | #5D5561 | title | "Maria Luiza" |
| Hero XV | 30 | 400 | 1.0 | 0.18em | #5D5561 | upper | between rules |
| Section heading | 42 | 400 | 1.1 | 0 | #5D5561 | sentence | "Data e local", "Momentos da festa" |
| Card / item title | 20 | 400 | 1.2 | 0 | #5D5561 | sentence | "Programação da festa", "Recepção" |
| Venue name | 18 | 400 | 1.2 | 0 | #5D5561 | sentence | "Casa Pérola" |
| Body / tagline | 14 | 400 | 1.7 | 0 | #6C6068 | sentence | tagline, descriptions |
| Address | 13 | 400 | 1.45 | 0 | #6C6068 | sentence | "Av. Paulista, 1500..." |
| Eyebrow | 9 | 600 | 1.2 | 0.20em | #8A8288 | upper | "CONVITE DE 15 ANOS", "MARIA LUIZA · 15 ANOS" |
| Date row | 14 | 400 italic | 1.4 | 0.02em | #5D5561 | sentence | "quinta-feira, 12 de novembro de 2026" |
| Time chip | 14 | 600 | 1.2 | 0 | #5D5561 | sentence | "20:30h" |
| Micro label | 10 | 500 | 1.2 | 0.16em | #8A8288 | upper | "CONVITE PARA", "COPIAR ENDEREÇO" |
| CTA | 16 | 500 | 1.0 | 0.02em | #FFFFFF | sentence | "Abrir convite" |
| Countdown number | 28 | 300 | 1.0 | 0 | #6A635A | numeric | "41" |
| Countdown label | 9 | 600 | 1.2 | 0.20em | #8A8288 | upper | "DIAS" |
| Outer theme label | 13 px | 500 | 1.2 | 4 px | #7A643B | upper | "TEMA" (video px) |
| Outer theme title | 61 px | 400 | 1.0 | 0 | #3F2125 | title | "Arco-íris" (video px) |
| Outer wordmark | 44 px | 500 | 1.0 | 0 | #47252D | title | "Capitulo15.com" (video px) |

Ink heights measured for calibration (`evidence/measurements.md`): name 32 px, section heading
21 px, card title 15 px, venue 9 px, body line 8 px, address line 9-10 px, eyebrow 4 px core,
countdown number 14 px.

## 5. Layout and Grid

* Design canvas 390x844 pt [I]; the mockup shows 390x840 pt of it (a few pt of status/home chrome
  are cropped at the screen edge).
* One column, no grid. Two margins coexist:
  * **text margin 32 pt** (23 px) — eyebrow and section headings start here;
  * **card margin 21 pt** (15 px) — cards are wider than the text column, 348 pt (250 px) wide,
    with 28 pt (20 px) internal padding.
* Spacing scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48 pt (4-based). Measured ink-to-ink rhythm in a
  section: eyebrow top -> heading top 28 pt; heading top -> dots 26 pt; dots -> card top 43 pt.
* Section bands are full-bleed illustrated washes; the background changes between sections with no
  rule or divider.
* Outer promo: 720x1280 canvas; "TEMA" ink 325,184,70,16 px; "Arco-íris" 258,225,202,43 px; phone
  208,320,304,644 px; wordmark 232,1040,256,44 px.

## 6. Shape, Depth and Effects

* Radius scale (visually estimated, `[I]`; the corner detector could not fit these soft low-contrast
  corners): card 20 pt (14 px), map 12 pt (8 px), countdown tile 15 pt (11 px), CTA and chips 999,
  icon circle 999, card hairline 1 px.
* Strokes: 1 px hairline #C1BABC on the address chip; 1 px #EFE8E8 divider inside the data card; no
  card borders.
* Shadows (CSS form, `[I]` from the visible falloff): card `0 10px 30px rgba(76,50,66,0.10)`; CTA
  `0 10px 24px rgba(76,50,66,0.22)`; phone mockup `0 30px 60px rgba(90,60,60,0.22)`, plus a 1 px
  inner rim `rgba(255,255,255,0.35)`.
* Blur/glass: none in the UI. The outer blobs are heavily blurred radial gradients.
* Other: watercolor rainbow arc (pale pastel bands, low opacity) and soft cloud masses; tiny white
  sparkles (1-2 px) scattered in the hero.

## 7. Iconography and Imagery

* Icons: minimal solid/outline glyphs in champagne #7A643B, about 17-18 pt tall inside a 42 pt
  (30 px) cream circle #F6E9E2; a 1 px vertical connector #E9DCD4 joins consecutive items. Icons
  seen: wine glass (Recepção), crown (Entrada da debutante), ballet shoe (Valsa), dinner/plate
  (Jantar, clipped). Style tag [I] — at 280 px the glyphs are only ~12 px.
* Photos: none.
* Illustration: the rainbow-and-clouds watercolor background is the main visual asset; treat it as
  supplied artwork or rebuild as layered CSS/SVG gradients.
* Map: a static Google-Maps-style raster with a plum pin labelled "Casa Pérola" and transit/POI
  markers, cropped inside the card. Do not redraw; use a map snapshot or placeholder.

Asset inventory:

| id | what | bbox px | status | crop file |
|---|---|---|---|---|
| A1 | Hero watercolor background (rainbow + clouds + sparkles) | 0,0,280,603 | rebuild / placeholder | crops/cover.png |
| A2 | Data-section wash (pale blue-pink band) | 0,245,280,358 | rebuild | crops/data.png |
| A3 | Momentos-section wash | 0,125,280,478 | rebuild | crops/programacao.png |
| A4 | Static map with pin | 35,389,210,111 (inside card) | provided by reference -> placeholder | crops/map.png |
| A5 | Glyph icons (glass, crown, shoe, plate) | 32,355,28,25 each | rebuild (custom SVG) | crops/prog_zoom.png |
| A6 | Phone mockup frame + notch | 208,320,304,644 | rebuild (CSS/SVG) | frames/0.00s.png |
| A7 | Capitulo15.com wordmark | 232,1040,256,44 | rebuild as text | frames/0.00s.png |

## 8. Components

**Pill CTA (Abrir convite)** — 258x64 pt (185x46 px), x 65, centred; radius 999; diagonal fill
#655365 -> #7E6379; label 16 pt white inset 18 pt; 18 pt arrow at the right inset 18 pt; soft plum
shadow. States seen: rest only.

**Section header** — left aligned at 32 pt; eyebrow 9 pt upper tracked #8A8288; heading 42 pt serif
#5D5561; 7-dot strip (dot 7 pt / 5 px, gap 8 pt / 6 px, pitch 15 pt) in the palette #B47E8E,
#C8917F, #D8C58A, #A9B49F, #9FAABB, #8C93AC, #9C8F9F [I]. It reads as a rainbow motif, not a
functional stepper — the first dot is identical in every section [?].

**Countdown tile** — 64x84 pt (46x60 px) centred; fill #FEF8EE; radius 15 pt; number 28 pt #6A635A;
label "DIAS" 9 pt tracked; no visible border.

**Data card** — 348 pt wide (250 px), x 21, radius 20 pt, fill #FCFAFB, padding 28 pt; soft shadow.
Anatomy (y offsets from the card top):
1. date row at 22 pt: italic serif 14 pt + time chip (bold serif 14 pt, pill, faint fill) with a 1 px
   divider 26 pt below;
2. "Endereço" label 12 pt sans #8A8288 at 45 pt;
3. venue "Casa Pérola" 18 pt serif at 74 pt;
4. address 13 pt sans, 1.45 line height, at 112 pt;
5. outlined chip "COPIAR ENDEREÇO" 10 pt upper, 0.16em tracking, 1 px #C1BABC, radius 999, 28x31 pt;
6. map 293x155 pt (aspect 1.9), radius 12 pt, full-bleed inside the card padding.
Card height as seen at 6.60 s: 414 pt (297 px).

**Programme card** — 348 pt wide, radius 20 pt, fill #FCFAFB, padding 28 pt; title 20 pt serif
#5D5561; each item is a title line (20 pt serif, 26 pt above) followed by an icon circle + body
(14 pt sans #6C6068, 1.7 line height, 26 pt below the title); items are separated by ~38 pt of ink
gap and a 1 px connector. Icon circle 42 pt, glyph ~17 pt.

**Phone mockup** — 304x644 px at 720x1280; body #35302F with a lighter 1 px rim; outer radius
~46 px [I]; screen 280x603 px radius ~34 px [I]; notch 120x22 px, radius 12 px bottom, #35302F [I];
side buttons protrude ~5 px on the left (volume) and right (power); soft shadow.

## 9. Screens

All screen coordinates are pt, origin at the top-left of the visible phone screen (390x840).

### 9.1 Cover (hero)

* Purpose and frame: full-screen invitation cover, 390x840 pt; the page scrolls, the phone frame
  does not.
* Layout tree (x/y/w/h): background 0/0/390/840; eyebrow 123/198/145/12; name 57/297/279/64; XV
  174/382/35/30 with 30x1 rules at y 394, x 146 and 219; date 167/428/53/14; "CONVITE PARA"
  153/527/81/11; guest 134/545/123/18; CTA 65/591/258/64.
* Components used: pill CTA, eyebrow, decorative rules.
* Exact copy: "CONVITE DE 15 ANOS" / "Maria Luiza" / "— XV —" / "12.11.26" / "CONVITE PARA" /
  "Tia Maria e família" / "Abrir convite" (with →).
* Imagery: A1.
* States visible: rest; tap state unknown.

### 9.2 Opened invitation (details)

* Purpose and frame: the same page after opening — the hero scrolls up and the details block is
  revealed: "15 anos • 12.11.26", a two-line tagline, the countdown and the 7 dots. Captured at
  3.60 s while the hero is still settling (name ink 247 pt wide, vs 279 pt on the cover).
* Layout tree (3.60 s, pt): eyebrow 84/102/220/12; name 71/155/247/45; XV 174/200/35/30; meta line
  128/265/160/14 centred; tagline 85/293/263/42 centred (2 lines); "FALTA POUCO PARA CELEBRAR"
  85/467/220/12; countdown tile 163/502/64/84; dots at 31/581.
* Settled scroll (4.80 s, pt): meta 145, tagline 145/174, "FALTA POUCO" 319, "41" 362-380, "DIAS"
  398, next section eyebrow 588.
* Exact copy: "CONVITE DE 15 ANOS" / "Maria Luiza" / "— XV —" / "15 anos • 12.11.26" /
  "Uma noite dourada para celebrar os 15 anos da Maria." / "FALTA POUCO PARA CELEBRAR" / "41" /
  "DIAS".
* Components used: countdown tile, section dots, eyebrow.
* States visible: the number reflects a live countdown (41 in the clip).

### 9.3 Data e local

* Purpose and frame: date/venue section. Full-bleed pale wash band; left-aligned header + card.
  Layout below is from the 5.60 s frame; the full card is visible at 6.60 s (everything 162 px
  higher).
* Layout tree (pt): eyebrow 31/408/145/12; heading 33/436/153/42; dots 31/490/102/7; card
  21/533/348/414; inside card (offsets from the card top): date row 49/+28, time chip 238/+26,
  divider 49/+54, label 49/+73, venue 49/+102, address 49/+140, chip 58/+188, map 49/+237.
* Exact copy: "MARIA LUIZA · 15 ANOS" / "Data e local" / "quinta-feira, 12 de novembro de 2026" /
  "20:30h" / "Endereço" / "Casa Pérola" / "Av. Paulista, 1500 - Bela Vista, São Paulo - SP,
  01310-100" / "COPIAR ENDEREÇO".
* Imagery: A2, A4, A5.
* States visible: rest.

### 9.4 Momentos da festa

* Purpose and frame: programme section. Full-bleed wash; header + programme card; the "Jantar" item
  is clipped by the end of the clip.
* Layout tree (pt, 9.20 s): eyebrow 31/259/130/12; heading 33/288/256/42; dots 31/341/102/7; card
  21/387/348/~470; card title 45/423/167/20; item 1 title 99/465/82/20, icon circle 45/494/42/42,
  body 98/499/199/61 (3 lines); item 2 title 98/591, body 98/623/197/57; item 3 title 98/724, body
  98/747/181/42; item 4 "Jantar" starts below the visible area (~800).
* Exact copy: "MARIA LUIZA · 15 ANOS" / "Momentos da festa" / "Programação da festa" /
  "Recepção" / "Um momento para receber os convidados e começar a comemoração." /
  "Entrada da debutante" / "A chegada da debutante marca o início de um dos momentos mais especiais
  da noite." / "Valsa" / "A tradicional valsa dos 15 anos, ao lado de pessoas especiais." / "Jantar".
* Imagery: A3, A5.
* States visible: rest; the next items are cut off.

### 9.5 Outer promo composition

* Purpose and frame: static marketing mockup, 720x1280 px (9:16).
* Layout tree (px): gradient background 0/0/720/1280; "TEMA" 325/184/70/16; "Arco-íris"
  258/225/202/43; phone 208/320/304/644; screen 220/332/280/603; wordmark 232/1040/256/44.
* Exact copy: "TEMA" / "Arco-íris" / "Capitulo15.com".
* Imagery: A6, A7.
* States visible: none; the mouse cursor at ~4.6 s is a screen-recording artifact, not UI.

## 10. Motion (video references only)

| # | Trigger | Element | Property | From -> To | Start ms | Duration ms | Easing | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | open invitation (CTA, implied) | whole phone screen | white veil opacity 0 -> 1 -> 0, cover -> details | 2700 | ~600 | ease-in-out | fade-through-white; cover out, details in |
| 2 | scroll (user/auto) | page content | translateY 0 -> ~1500 pt | 3000 | ~6800 | not eased / user-driven | ~200-260 px/s (280-362 pt/s); frame static |
| 3 | countdown | "41" | numeric | live value | — | — | — | dynamic in the product; static in the clip |
| 4 | cursor | pointer | position | moves over the phone at ~4600 ms | 4600 | — | — | recording artifact, exclude from the UI |

Idle/loop animations: none visible (no shimmer, float or parallax in the 10 s). The background is a
still illustration. Scroll-linked effects: none beyond the scroll itself.

## 11. Direction

* Feel: dreamy, romantic, quiet luxury; a watercolor birthday invitation, not a web app.
* The 3 details that must survive:
  1. Cormorant-style italic hero name with thin, wide-tracked microtype around it;
  2. the rainbow-and-clouds watercolor wash with a soft white veil over it;
  3. the oversized serif headings (42 pt) inside generous margins, with the pale 7-dot strip.
* Keep the palette low-contrast and the depth soft; any hard shadow or saturated accent breaks it.

## 12. Unknowns and assumptions

| Item | Why unknown | Assumption used | How to resolve |
|---|---|---|---|
| Font family | Pixels cannot identify a font | Cormorant Garamond + Montserrat | ask the client / inspect the live site |
| Design width | mockup hides the device | 390x844 pt, preview scale 0.718 | confirm the source device / live CSS |
| Type sizes | derived from ink at 280 px | scale above, ±15% | inspect the live CSS |
| 7 dots | no interaction shown | decorative rainbow strip, not a stepper | inspect the live page |
| Content after "Jantar" | clip ends | unknown, not invented | ask for the full recording or live URL |
| RSVP/confirmation flow | not shown | none documented | ask for the flow or a screen recording |
| Map provider/style | raster only | Google Maps snapshot, plum pin | use a static map or placeholder |
| Hover/tap/focus states | not shown | rest only | inspect the live page |
| Countdown target | static value "41" | dynamic days to 2026-11-12 | compute from the event date |
| Watercolor asset | hand-painted look | rebuild as gradients or supply the asset | request the source artwork |
| Card/tile radii | corner detector failed on soft edges | 20 / 15 / 12 pt | measure the live CSS |

## 13. Coverage audit

- [x] every element listed — outer composition, hero, details, data, momentos, CTA, cards, dots,
  icons, map
- [x] every string transcribed — sections 9.1-9.5; map labels excluded as raster asset
- [x] colors reconciled — every on-screen color mapped to a token in sections 3 / tokens.json;
  shadows and gradients flagged `[I]`
- [x] spacing reconciled — 4-based scale; text margin 32, card margin 21, card padding 28, sizes
  348/258/64
- [x] radii reconciled — 20/15/12/999 + phone 46/34, all tagged
- [x] states marked — rest only; the details state is a scroll position, not a separate page
- [x] assets inventoried — A1-A7 with bboxes and status
- [x] raw measurements archived — `evidence/measurements.md`
- [x] exact fidelity numbers — compare.py run against 0.00s.png and cover.png (MAE 5.79, SSIM 0.9327); fidelity-report.md saved.
