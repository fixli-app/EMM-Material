## Goal
Rewrite the **Methodology** and **How Scoring Works** sheets in the workbook so anyone — even a non-technical reader — instantly understands how a match score is produced. Keep everything else in the workbook untouched. Save as a new version `hoganas-material-combination-analysis-v4.xlsx`.

## The problem with the current sheets
They are accurate but read like engineering docs: Greek `Σ` sum notation, phrases like "normalized property scores", "activated properties", weights on a "0-100 scale", and dense paragraphs. A first-time reader has to work to follow it.

## What changes

### Sheet: "How Scoring Works" (simplified)
Replace the current wording with plain English and one everyday analogy. Structure:

1. **The idea, in one line (with an analogy)**
   "A score is just a smart average — like grading a student, but the subjects that matter most for the job count more."

2. **How it works in 3 simple steps** (no symbols, no jargon):
   - Step 1 — *Decide what matters.* The application (e.g. Traction Motors) tells us which properties are important.
   - Step 2 — *Give each material a mark out of 100* for every property that matters.
   - Step 3 — *Take the average, giving extra weight to the important properties.* Expert-recommended grades get a small +5 head start.

3. **One clear worked example** (Traction Motors → Somaloy 1000 3P), shown as a simple table anyone can add up:
   ```text
   Property                 Mark (0-100)   Importance   Mark × Importance
   Permeability                  95           High             66.5
   ...
   Add up the marks × importance      = 293.3
   Add up the importance              = 3.5
   Average = 293.3 ÷ 3.5              = 84
   Recommended grade bonus           = +5
   FINAL SCORE                       = 89
   ```
   Ends with a one-line plain reading: "89 out of 100 — strong where it counts, plus 5 points for being expert-recommended."

4. **A tiny contrast example** (a non-recommended grade scoring lower) kept, but trimmed to 2 lines so the reader sees why scores differ — without a wall of numbers.

5. **Good to know** — 3 short friendly bullets: the +5 only breaks close calls; the industry choice never changes the score; the marks come from Höganäs datasheets.

The challenge-boost example (Example 3) is simplified into one short note rather than a full second calculation table, to keep the sheet light.

### Sheet: "Methodology" (simplified)
Rewrite the 7 dense numbered points into short, plain-language statements — same facts, half the words, no `Σ` symbols. Each point becomes one easy sentence (e.g. "Score = the weighted average of a material's marks. Higher marks on the important properties = higher score."). Keep the "what to validate" note at the bottom in simple bullets.

## Styling
Match the existing workbook exactly: same navy/steel header colours, fonts, title/subtitle rows, borders and column widths already used on these sheets, so it looks like a native part of the report. Language stays English (per project standard). No emojis.

## Technical notes
- A Python script loads `hoganas-material-combination-analysis-v3.xlsx` with `openpyxl`, deletes and rebuilds only the two sheets (preserving their position in the tab order), and copies the styles already present in the file.
- The worked example numbers are pulled/reconciled against the existing "Combination Matrix" so the final score (89) still matches the tool exactly — the math stays correct, only the wording gets simpler.
- Save as `hoganas-material-combination-analysis-v4.xlsx` in `/mnt/documents`; the v3 file is left intact.
- After saving, every sheet is rendered to an image and inspected for overflow/clipping before delivery.

## Result
The technical team (and anyone else) can open two clean tabs and understand the whole scoring system in under a minute, with one hand-checkable example — no math background required.