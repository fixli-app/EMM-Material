# Add a "How Scoring Works" sheet with worked examples

Extend the existing audit workbook with one new sheet that explains the scoring system in plain language and walks through 2-3 fully calculated examples, so anyone — technical or not — can follow exactly how a score is produced.

## What gets added

A new sheet named **"How Scoring Works"** appended to `hoganas-material-combination-analysis-v2.xlsx` (saved as a new version `-v3.xlsx`, all existing 8 sheets untouched). It matches the workbook's existing navy/steel corporate styling, title/subtitle header rows, and formatting.

The sheet has four parts, top to bottom:

### Part 1 — The idea in one sentence
A short banner explaining that a score (0-100) is simply a *weighted average* of a material's property scores, judged against how important each property is for the chosen application.

### Part 2 — The four steps (plain language)
A clean numbered table, each step in everyday words + the technical detail beside it:
1. **Pick what matters** — the application decides which properties count and how heavily (weight 0-100).
2. **Look up each material's property scores** — every material has a 0-100 score per property (from the Materials Reference sheet).
3. **Take the weighted average** — `Score = Σ(propertyScore × weight) ÷ Σ(weight)`.
4. **Add the recommendation bonus** — expert-recommended grades get +5, capped at 100, then rounded.

### Part 3 — Fully worked examples
2-3 real rows taken straight from the Combination Matrix, each shown as a mini calculation table so the reader can add it up by hand:

```text
Example: Traction Motors → Somaloy 1000 3P
Property              Material score   Weight   score × weight
Saturation Induction      90            0.90        81.0
Core Loss (high freq)     85            0.90        76.5
Permeability (μmax)       95            0.70        66.5
...
Sum of (score×weight) = ...      Sum of weights = ...
Weighted average = ... ÷ ... = 84
+ Recommendation bonus (+5)      = 89  ← final Score
```

Each example ends with a one-line "reading" in plain words ("This grade scores 89/100 because it is strong on the properties that matter most for traction motors, and it is on the expert-recommended list, adding 5 points.").

I'll include:
- One **recommended** material (shows the +5 bonus).
- One **non-recommended** material (no bonus) for contrast.
- Optionally one with a **challenge scenario** active (shows how a boost raises a weight).

### Part 4 — Things to remember
Short bullet notes: bonus only breaks ties (never overrides real superiority); industry is a filter, not a score factor; property scores are normalized 0-100 relative to the Somaloy portfolio and are what the technical team should validate.

## How it's built (technical)
- A Python script reads the material portfolio, property weights, application requirements, challenge boosts and recommendation lists from `src/data/materials.ts`, and re-implements the exact scoring logic from `SmartSelector.tsx` (weight ≥70 activation, challenge boosts capped at 100, weighted average, +5 recommendation bonus, cap+round).
- For each chosen example it captures every intermediate number (per-property score, weight, product, the two sums, the raw average, the bonus, the final rounded score) so the printed math reconciles exactly to the "Score (0-100)" already in the Combination Matrix.
- It loads the existing `.xlsx` with `openpyxl`, appends only the new sheet, applies matching fonts/fills/borders and column widths, and saves `hoganas-material-combination-analysis-v3.xlsx` in `/mnt/documents`.
- The new sheet is rendered to an image and inspected for overflow/layout before delivery; example totals are verified against the Combination Matrix scores.

## Result
The technical team gets the same workbook plus one self-contained "How Scoring Works" tab: a plain explanation followed by real, hand-verifiable calculations that reconcile to the scores already in the matrix.
