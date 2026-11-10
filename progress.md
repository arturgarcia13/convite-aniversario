# Progress

## Task contract

- **Outcome**: replication kit for `reference-invitation-confirm.mp4`, built with the
  `design-reference-replicator` skill — `design-spec.md`, `tokens.json`, `recreation-prompt.md`,
  `evidence/` under `outputs/invite-confirmation/`.
- **Scope**: whole 10 s / 720x1280 video; detailed measurement of the mobile invitation UI inside the
  phone mockup; outer promo composition documented but not treated as the product UI.
- **Out of scope**: building a running app in this repo (no app exists; build step is offered as next
  action, section 8 of the skill).
- **Acceptance evidence**: files exist; every `[M]` value traceable to `evidence/measurements.md`;
  coverage audit (checklist section M) reconciled; `tokens.json` parses.
- **Approval needed**: none — read-only analysis of local files plus file writes in this directory.
- **Iteration ceiling**: 3 repair passes per deliverable file.

## State

- 2026-11-09: zip extracted, environment verified (`uv run --with pillow --with numpy`), video probed
  (720x1280, 30 fps, 10.0 s, h264).
- 2026-11-09: 50 frames extracted at 0.2 s; screen crop fixed at (220,332) 280x603; screens
  inventoried (cover, details, data, map, momentos, programme).
- 2026-11-09: first draft of the three deliverables written, then a measurement pass with row
  profiles corrected the geometry (card 348 pt not 298, CTA 258x64 not 249x64, type scale smaller than
  the first estimate). Drafts rewritten; `evidence/measurements.md` written.
- 2026-11-09: validations run: `tokens.json` parses, `feature_list.json` parses, hex sets in spec and
  tokens match exactly, 13 spec sections present.
- 2026-11-10: interactive prototype implemented at `outputs/invite-confirmation/demo/index.html`.
- 2026-11-10: headless rendering and fidelity loop completed with `compare.py` against both
  `0.00s.png` (MAE 5.79, SSIM 0.9327) and `cover.png` (MAE 5.93, SSIM 0.8786).
- 2026-11-10: `fidelity-report.md` written and comparison artifacts saved to `evidence/comparison/`.
  Full replication lifecycle is complete.

## Decisions

- Scripts run via `uv run` ephemeral env (no pip/Pillow on system python).
- Deliverable layer = the mobile invitation UI; the outer promo is documented as framing.
- Design canvas 390x844 pt, screen 280x603 px, scale 0.718 px/pt — `[I]`, all pt values are a
  projection of measured px.
- Type sizes are `[I]` derived from ink heights and widths, ±15%. Geometry is `[M]` where it comes
  from flat card surfaces or from the row profile.
- Radii are `[I]`: `measure.py radius` cannot fit the soft low-contrast corners.

## Open questions

- Fonts (Cormorant Garamond + Montserrat) are inferred; the real family would change all metrics.
- Content below "Jantar", any RSVP flow, hover/tap states: not in the clip.
- Card/tile radii need the live CSS to be exact.

## Evidence

- `outputs/invite-confirmation/design-spec.md` (13 sections)
- `outputs/invite-confirmation/tokens.json` (valid JSON, hex set == spec hex set)
- `outputs/invite-confirmation/recreation-prompt.md` (variant A image + variant B build brief)
- `outputs/invite-confirmation/evidence/measurements.md` (raw profiles, palettes, conversions, limits)
- `outputs/invite-confirmation/evidence/` 8 frames, 5 sheets, 20 crops

## Next action

- Offer to build the HTML/CSS prototype + promo frame to close the loop with `compare.py` against
  `evidence/frames/0.00s.png` / `evidence/crops/cover.png` and produce `fidelity-report.md` (if requested).
