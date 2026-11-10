# Output templates

The structure mirrors the user's Design Prompts (intro, "The app helps users", Design Style, Color Palette, Typography, Screens, Direction, and the extended
Presentation / 3D Visual Assets / Icons blocks), with measured values added so the result is reproducible instead of "inspired by".
Write the files in English. Tag every value `[M]` measured, `[I]` inferred, or `[?]` unknown. Delete a section only if it truly does not apply.

---

## File 1: `design-spec.md`

```markdown
# <Name> Design Spec
Source: <file names> | Kind: <screen | board | web page | video> | Canvas: <W x H px> | Device scale: <@Nx> -> <W x H pt> | Extraction confidence: <high/medium/low and why>

## 1. What the reference shows
<Product name if visible, what it does, who it is for, and the features visible on screen.>
The product helps users:
* <visible capability>
* <visible capability>

## 2. Design Style
* <style adjectives that are visibly true: minimal, editorial, glassmorphic, brutalist, 3D glossy...>
* Mode: <light | dark | both>; density: <airy | comfortable | compact>; overall feel: <...>
* Radius character: <soft | sharp | pill>; depth: <flat | subtle | floating | skeuomorphic>
* NOT: <what it visibly avoids, e.g. cluttered, corporate, boxy>

## 3. Color Palette
| Role | Hex | Usage | Tag |
|---|---|---|---|
| Background | #FFFFFF | page background | [M] |
| ... | | | |
Gradients: `<name>`: linear <angle>deg, <#hex 0%>, <#hex 50%>, <#hex 100%>, used on <...> [M]
Overlays and scrims: <color, alpha, direction> | Glass: <tint, opacity, blur> | Dark-mode counterparts: <...>
Contrast checks: <pair: ratio>

## 4. Typography
Family: <best candidate> (alternatives: <2>; confidence <...>) [I]; fallback: <free font>
| Style | Size pt | Weight | Line height | Tracking | Color | Case | Where used |
|---|---|---|---|---|---|---|---|
| Display | 34 | 700 | 41 | -0.4 | #1F1F1F | sentence | hero titles |

## 5. Layout and Grid
Canvas, safe areas, margins, gutters, columns, base unit and spacing scale (<4/8/12/16/24/32>), section rhythm, bar heights, alignment rules.

## 6. Shape, Depth and Effects
Radius scale: <list with where each is used> | Strokes: <width, color> | Shadows (CSS form): <name: 0 8px 24px rgba(...)> [I] | Blur/glass: <...> | Other effects: <glow, grain, highlights>

## 7. Iconography and Imagery
Icons: style, stroke, grid, container, active/inactive, likely library. Photos: treatment, ratios, overlays. Illustration/3D: style, materials, lighting.
Asset inventory: | id | what | bbox px | status (provided / rebuild / placeholder) | crop file |

## 8. Components
One block per component: anatomy, size, padding, radius, fill/stroke/shadow, text style, icon, states seen, variants. Include the tokens each uses.

## 9. Screens
### 9.N <Screen name>
* Purpose and frame: <size px / pt>, scroll behavior, sticky elements
* Layout tree, top to bottom, with x, y, w, h in pt: <element, position, size, parent, alignment>
* Components used: <links to section 8 blocks>
* Exact copy: <every string verbatim>
* Imagery: <asset ids>
* States visible: <...>

## 10. Motion (video references only)
| # | Trigger | Element | Property | From -> To | Start ms | Duration ms | Easing | Notes |
Idle/loop animations, scroll-linked effects, gesture behavior, overall pacing.

## 11. Direction
The feel in bullets (e.g. premium, calm, energetic) plus the 3 details that make it recognizable and must not be lost.

## 12. Unknowns and assumptions
| Item | Why unknown | Assumption used | How to resolve |
|---|---|---|---|

## 13. Coverage audit
[ ] every element listed [ ] every string transcribed [ ] colors reconciled [ ] spacing reconciled [ ] radii reconciled [ ] states marked [ ] assets inventoried
```

---

## File 2: `tokens.json`

```json
{
  "meta": {"source": "", "canvas_px": [0, 0], "scale": 3, "unit": "pt"},
  "color": {"bg": {"value": "#FFFFFF", "tag": "M"}, "surface": {}, "text": {"primary": {}, "secondary": {}}, "accent": {"primary": {}},
            "state": {"success": {}, "error": {}}, "gradient": {"cta": {"angle": 90, "stops": [["#FF6B4A", 0], ["#FFC107", 1]]}}},
  "font": {"family": {"primary": "Inter", "fallback": "system-ui"}, "scale": {"title": {"size": 28, "weight": 700, "lineHeight": 34, "tracking": -0.3}}},
  "space": [4, 8, 12, 16, 24, 32],
  "radius": {"card": 20, "button": 999, "input": 14, "image": 16},
  "stroke": {"hairline": 1},
  "shadow": {"card": "0 8px 24px rgba(0,0,0,0.08)"},
  "blur": {"glass": 24},
  "icon": {"size": 24, "stroke": 1.75},
  "layout": {"margin": 20, "gutter": 12, "tabBar": 49, "navBar": 44},
  "motion": {"fast": {"ms": 180, "easing": "cubic-bezier(0.2,0,0,1)"}}
}
```
Every leaf that is not obvious carries its tag (`M`, `I`, `?`). Units are pt/dp unless a key says px.

---

## File 3: `recreation-prompt.md`

Same shape as the user's Design Prompts. Fill it from the spec with concrete values, not adjectives alone. Write two variants.

### Variant A: image-generation prompt
```markdown
Generate an image of <a complete mobile app UI design system and all screen designs | a UI showcase board | a landing page> for <Name>, <one-sentence product>.
<If a board: PRESENTATION: layout of screens, grid, gaps, frame style, background, aspect ratio, status bars.>

## Design Style
* <bullets from spec 2, including the NOT list>

## Color Palette
* <role>: <#hex> ... (all roles, gradients with angle and stops)

## Typography
* <family or closest look>, <scale with sizes and weights>, <case and tracking notes>

## Layout and Components
* <margins, spacing scale, radii, shadows, icon style, key component specs with sizes>

## Screens
### 1. <Screen name>
* <every element in order, with exact copy in quotes>
...

## 3D / Illustration / Imagery (if any)
* <materials, lighting, renderer look, composition>

## Direction
<the feel and the recognizable details; "match the attached reference exactly: same layout, spacing, colors, copy, and proportions; do not restyle or add elements">
```

### Variant B: build brief for code (HTML/CSS/React/SwiftUI)
```markdown
Build <screens> to match the reference exactly. Use these tokens (tokens.json): <inline summary>.
Canvas <W x H pt>. For each screen: element list with x, y, w, h, tokens and exact copy. Assets: <ids and statuses>.
Motion: <timeline summary>. Acceptance: run scripts/compare.py against the reference at the same size; target SSIM >= 0.97, MAE <= 3; fix the worst grid cells first.
```
Always add a line telling the generator to attach or look at the reference image when the tool allows it, because words alone cannot guarantee an identical result.
