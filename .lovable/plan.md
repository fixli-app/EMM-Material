# Material Selector: three user paths + application-driven recommendations

## What changes

### 1. Three starting points instead of two
The first step ("Choose your starting point") gets three cards:

- **Motor Designers / Motor Manufacturer** → goes to a new **Select Application** step
- **Part Manufacturers (PM Houses)** → goes straight to Fine-tune Requirements (as today)
- **OEMs** → goes straight to Fine-tune Requirements (as today)

### 2. New application list (Motor Designers path only)
Eight applications, each with a fixed, curated shortlist of three recommended grades:

| Application | 1 | 2 | 3 |
|---|---|---|---|
| AFM Traction / Propulsion Motors | Somaloy 700 7P | Somaloy 130i 5P | Somaloy 700HR 3P |
| Light Mobility Motors (2-/3-wheelers) | Somaloy 700 7P | Somaloy 130i 5P | Somaloy 700HR 3P |
| Electric Pumps (water, oil, cooling) | Somaloy 700 7P | Somaloy 700HR 5P | Somaloy 700HR 3P |
| Compressors, Fans & Blowers | Somaloy 700 7P | Somaloy 700 1P | Somaloy 700HR 3P |
| Robotics & Compact Motors | Somaloy 700 7P | Somaloy 700HR 5P | Somaloy 700HR 3P |
| Drones | Somaloy 700 7P | Somaloy 700HR 5P | Somaloy 700HR 3P |
| Transformers | Somaloy 110i 5P | Somaloy 110i 1P | Somaloy 130i 5P |
| Solenoids & Actuators | Fe / FeP solutions (uncoated) | Somaloy 500 1P | Somaloy 1000 3P |

### 3. Results show only the recommended grades
After picking an application, the results view shows **only** those three recommendations — nothing else from the catalogue. Fine-tune Requirements still works: the property sliders re-rank and re-score those three so the best fit for the stated priorities lands on top, with match scores and radar charts exactly as today.

Two entries in the list are families rather than single rows in the database, and will be rendered as a group under their rank:

- **Somaloy 700 7P** — the four density variants (7.30 / 7.40 A / 7.40 B / 7.50 g/cm³) appear together, so the designer can pick the density that suits the part.
- **Fe / FeP solutions** — the uncoated iron grades (PASC, ABC 100.29 + P, ASC 100.29) appear together.

The Part Manufacturer and OEM paths keep the current behaviour: full catalogue, ranked purely by properties.

## Technical notes

- `src/data/materials.ts`: replace the current `applications` array with the eight motor-designer applications, each holding an ordered `recommendedMaterials` list of material ids (plus family ids where a group is intended).
- `src/components/SmartSelector.tsx`:
  - `UserPath` gains `"oem"`; the path grid becomes three cards.
  - Step machine becomes `path → application (motor designers only) → properties → results`; the step indicator shows 3 steps on the motor path, 2 on the others.
  - New `selectedApplication` state. When set, the scoring pipeline filters the catalogue down to that application's recommended ids before ranking; when unset, current behaviour (including the 1P/cost-efficiency visibility rule) is unchanged.
  - Results header names the selected application and offers a "change application" action.
- No backend or data-model changes beyond the application definitions.
