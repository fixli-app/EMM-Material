# Add Expert Insights to the audit workbook

Extend the existing `hoganas-material-combination-analysis.xlsx` with new sheets that reproduce exactly what the app's **Expert Insights** panel generates, so the technical team can verify that logic too — alongside the scoring already in the workbook.

## What gets added

The current workbook has 6 sheets (Combination Matrix, Rec vs Algorithm, Materials Reference, Materials Datasheet Specs, Applications Reference, Methodology). I'll add two new sheets, matching the existing navy/steel corporate styling, title/subtitle header rows, and formatting.

### Sheet 1 — "Expert Insights"
One row per material (all 17 grades), reproducing exactly what the panel shows when a material is expanded:

| Column | Content |
|---|---|
| Material | Grade name |
| Category / Series | e.g. Somaloy 700 3P, and detected series (1P / 3P / 5P) |
| Description | The material's `description` text (word-for-word from the app) |
| Key Strengths | The auto-generated "Key strengths" sentence, using the exact same thresholds as the app (permeability ≥70 → "high permeability (μmax …)", ≥40 → "moderate"; core loss low/high ≥70; saturation ≥70; resistivity ≥70; TRS ≥70; thermal ≥70; cost efficiency ≥70) with the real spec values inserted |
| Applications | The applications list shown in the panel |
| Density / Particle size / Curing temp | The metadata badges |
| Process | The process chain (`step → step → step`) |

This lets experts confirm each generated "Key strengths" statement is factually correct against the datasheets.

### Sheet 2 — "Best Match (Expert Advice)"
Reproduces the application-based recommendation logic (the highlighted "Recommendation for …" box). For each of the 9 applications:

| Column | Content |
|---|---|
| Application | App name |
| Best Match grade | The top-recommended grade (lowest index in `recommendedMaterials`) |
| Reasoning sentence | The exact generated sentence (μmax, saturation, core loss @1T/1kHz) |
| Also recommended | The remaining recommended grades, in order |
| Algorithm top grade | The #1 grade from the scoring algorithm for that application (for cross-check) |
| Match? | Whether Best Match aligns with the algorithm's top result |

This makes explicit where the editorial "Best Match" agrees or differs from the pure algorithm, which is the one thing still pending expert sign-off.

## How it's built
- A script reads the material portfolio, properties, specifications and application recommendations from `src/data/materials.ts`, and re-implements the `ExpertInsights.tsx` string-generation logic verbatim (thresholds, spec interpolation, best-match ranking).
- It loads the existing `.xlsx` with `openpyxl`, appends the two sheets (preserving all existing sheets), applies matching styles, and saves a new versioned file `hoganas-material-combination-analysis-v2.xlsx` in `/mnt/documents`.
- Each sheet is rendered to images and inspected for layout/overflow issues before delivery.

## Result
A single updated workbook the technical team can walk through end-to-end: the scoring matrix (existing) **and** the Expert Insights + Best Match text the app shows to users, ready for correctness review against the datasheets.
