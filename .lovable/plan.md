## Mål
Lägg till en ny, egen **"Feedback"**-flik i arbetsboken där tekniska teamet, säljare m.fl. kan skriva in kommentarer, förslag och vad som ska läggas till/tas bort. Allt annat i arbetsboken lämnas orört. Sparas som ny version `hoganas-material-combination-analysis-v6.xlsx`.

## Fliken "Feedback"

Placeras först i flikordningen (eller direkt efter "Website Comparison") så teamet ser den direkt.

**Titel + underrubrik** överst i samma navy/steel-stil som övriga flikar:
- Titel: "Feedback & Suggestions"
- Underrubrik: "For the technical team, sales and reviewers — add comments, corrections and ideas here."

**Kolumner (tabellhuvud i navy):**

```text
#  | Sheet / Area        | Row / Item        | Type       | Comment / Suggestion            | Suggested by | Date       | Priority | Status
1  | Combination Matrix  | Traction Motors   | Correction | ...                             | ...          | ...        | High     | Open
2  | Best Match          | ...               | Add        | ...                             | ...          | ...        | Medium   | Open
```

- **#** — löpnummer.
- **Sheet / Area** — vilken flik/område kommentaren gäller.
- **Row / Item** — specifik rad/material/applikation.
- **Type** — Add / Remove / Correction / Question / Idea (via dropdown-datavalidering).
- **Comment / Suggestion** — fritextfält (bred kolumn, radbrytning på).
- **Suggested by** — namn.
- **Date** — datum.
- **Priority** — High / Medium / Low (dropdown).
- **Status** — Open / In review / Done (dropdown).

**Innehåll:**
- ~25 tomma, färdigformaterade rader att fylla i, med tunna kantlinjer och alternerande radfärg (zebra) för läsbarhet.
- 2–3 exempelrader överst (ljust markerade) som visar hur man fyller i — t.ex. "Combination Matrix / Traction Motors / Correction / 'Kontrollera permeabilitetspoäng mot senaste datablad' / High / Open".
- En kort instruktionsrad/banner ovanför tabellen: "Fill in one row per suggestion. Use the dropdowns for Type, Priority and Status."

## Styling
Matchar befintlig arbetsbok exakt: samma navy/steel-färger, Arial-typsnitt, titel/underrubriksrader, kantlinjer och kolumnbredder som övriga flikar. Engelska (per projektstandard). Inga emojis. Dropdown-listor via openpyxl `DataValidation`.

## Tekniska noter
- Python-skript laddar `hoganas-material-combination-analysis-v5.xlsx` med `openpyxl`, lägger till en ny "Feedback"-flik utan att röra övriga flikar, och kopierar befintlig stil (färger/typsnitt).
- Sparas som `hoganas-material-combination-analysis-v6.xlsx` i `/mnt/documents`; v5 lämnas intakt.
- Efter sparande renderas fliken till bild och kontrolleras för overflow/klippning innan leverans.

## Resultat
Teamet får en tydlig, ifyllbar flik med dropdowns och exempel där de strukturerat kan lämna feedback om vad som ska läggas till, tas bort eller korrigeras i hela arbetsboken.