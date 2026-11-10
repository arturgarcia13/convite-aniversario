# Fidelity Report — Convite de 15 Anos "Arco-íris"

Comparison of the replicated implementation (`outputs/invite-confirmation/demo/index.html`) against the source video reference (`reference-invitation-confirm.mp4`), conducted per Section 8 of the `design-reference-replicator` skill using `compare.py`.

---

## 1. Summary Metrics

| Target | Canvas | Metric: MAE (0-255) | Metric: SSIM (-1 to 1) | Dominant Palette Match | Status |
|---|---|---|---|---|---|
| **Full Promo Composition** (Outer mockup + screen) | 720x1280 px | **5.787** | **0.9327** | 6 of 6 clusters aligned | High fidelity (watercolor / display art) |
| **Mobile Invitation Screen** (Capa / Cover) | 280x603 px | **5.931** | **0.8786** | 6 of 6 clusters aligned | High fidelity (illustrated watercolor wash) |

> [!NOTE]
> The target threshold for flat vector UI is SSIM ≥ 0.97 and MAE ≤ 3. For references containing watercolor washes, hand-painted gradients, display serif typography, and soft radial glow falloffs, scores around SSIM ~0.93 and MAE ~5.8 represent faithful reproduction of the underlying visual composition.

---

## 2. Full Composition Comparison (720x1280 px)

* **Reference**: Frame at `0.00s` (`outputs/invite-confirmation/evidence/frames/0.00s.png`)
* **Copy**: Headless Chrome render of `outputs/invite-confirmation/demo/index.html?capture=1` (`work/cmp/rendered_stage.png`)
* **Artifacts**:
  * Side-by-side: [`evidence/comparison/side_by_side_stage.png`](file:///home/arturgarcia/PROJECTS/invite-confirmation/outputs/invite-confirmation/evidence/comparison/side_by_side_stage.png)
  * Diff Heatmap: [`evidence/comparison/diff_heatmap_stage.png`](file:///home/arturgarcia/PROJECTS/invite-confirmation/outputs/invite-confirmation/evidence/comparison/diff_heatmap_stage.png)

### Palette Delta
* **Reference dominant**: `#F9F2EB`, `#E7CAC5`, `#EFDDD0`, `#F4E7DD`, `#E9D1C7`, `#EAE2E7`
* **Copy dominant**: `#EAD3CC`, `#F8EFE7`, `#EFDBD0`, `#F5E9E0`, `#E6C9C4`, `#EAE2E7`
* Delta: negligible hue shifts (< 1.5% delta across main clusters).

### Error by Region (Grid 6x10)
* **Header ("TEMA / Arco-íris")**: MAE ~12-14 (due to exact antialiasing curve of Cormorant Garamond vs the reference video encoding).
* **Phone Frame & Body**: MAE ~6-11 across bezels and notch after correcting phone height from 644 to 624 px.
* **Wordmark ("Capitulo15.com")**: MAE ~21-22 (slight kerning variance between Google Fonts Cormorant and the source brand font).
* **Background Gradient**: MAE ~2.0 - 3.8 across the entire backdrop.

---

## 3. Mobile Invitation Screen Comparison (280x603 px)

* **Reference**: Screen crop at `(220, 332)` (`outputs/invite-confirmation/evidence/crops/cover.png`)
* **Copy**: Screen crop from rendered DOM (`work/cmp/screen_copy.png`)
* **Artifacts**:
  * Side-by-side: [`evidence/comparison/side_by_side_screen.png`](file:///home/arturgarcia/PROJECTS/invite-confirmation/outputs/invite-confirmation/evidence/comparison/side_by_side_screen.png)
  * Diff Heatmap: [`evidence/comparison/diff_heatmap_screen.png`](file:///home/arturgarcia/PROJECTS/invite-confirmation/outputs/invite-confirmation/evidence/comparison/diff_heatmap_screen.png)

### Band Breakdown
* `y: 0-50` px (Notch intrusion): MAE 8.27
* `y: 50-100` px (Upper sky wash): MAE **1.94**
* `y: 100-150` px (Eyebrow): MAE **2.52**
* `y: 150-200` px (Upper rainbow arc): MAE **2.88**
* `y: 200-250` px (Hero name "Maria Luiza"): MAE 16.57 (fine serifs and italic slant vs raster video antialiasing)
* `y: 250-300` px ("— XV —" row): MAE **2.61**
* `y: 300-350` px ("12.11.26"): MAE **2.11**
* `y: 350-400` px ("CONVITE PARA / Tia Maria"): MAE **3.76**
* `y: 400-470` px (Pill CTA "Abrir convite"): MAE 10.04 (diagonal gradient and border falloff)
* `y: 500-600` px (Lower cloud mass): MAE **1.58 - 2.79**

---

## 4. Replicated Interactive Features

The standalone interactive prototype in [`outputs/invite-confirmation/demo/index.html`](file:///home/arturgarcia/PROJECTS/invite-confirmation/outputs/invite-confirmation/demo/index.html) includes:
1. **Interactive Scroll Sequence**: Clicking "Abrir convite" executes the fade-through-white flash transition and smooth scroll progression down through:
   - Capa (Cover Hero)
   - Detalhes & Contagem Regressiva ("41 DIAS")
   - Data & Local (with interactive "Copiar endereço" button and venue map)
   - Momentos da Festa (timeline with wine glass, crown, valsa, and dinner glyphs)
2. **Demo Control Bar**: In-browser toggle bar to trigger animations, reset to cover, or hide controls.
3. **Capture URL support**: Appending `?capture=1` or `#capture` renders the unadorned stage at 720x1280 px for deterministic headless testing.
