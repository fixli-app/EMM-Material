# Rejäl genomgång — Din Somaloy®-app vs hoganas.com

Detta är ett redovisningsdokument (ingen kodändring). Det täcker tre saker:
1. Vad som finns på **din** sida
2. Vad som finns på **hoganas.com/sv/.../soft-magnetic-composites/**
3. Strategisk jämförelse + exakt hur allt jag byggt åt dig fungerar (selector, poängsystem, radar, Best Match)

---

## DEL 1 — Vad finns på din sida

Din app är en **interaktiv beslutsmotor** byggd kring Somaloy®. Fyra sidor:

**1. Technologies (startsida `/`)**
- Hero, "Three-dimensional magnetic circuit design"-intro, 6 nyckelfördelar (Compact design, High performance, Cost efficiency, 3D flux, Scalable production, Sustainable/re-Somaloy®).
- Applikationer uppdelade Automotive / Industrial.
- Case-kort (Axial flux, Koenigsegg Regera) som öppnar PDF-broschyrer i modal + länkar till riktiga Höganäs case.

**2. Material Selector (`/selector`) — kärnan i appen**
- 3-stegsguide: **Application → Requirements → Results**.
- **41 materialposter** i databasen, varav portföljen täcker:
  - Coated SMC **5P** (4 grades) — lägst kärnförluster
  - Coated SMC **3P** (3 grades) — högst mekanisk hållfasthet
  - Coated SMC **1P** (5 grades) — mest ekonomiska
  - Uncoated: Fe-Si, Fosfor-järn (PASC, ABC+P), rent järn (ASC 100.29)
- 8 applikationer (traction motors, AC-kompressorer, pumpar, DC/DC, industridrifter, fläktar, sol/förnybart, induktorer/transformatorer, sensorer/solenoider).
- 11 viktbara egenskaper med riktiga datablads-värden (μmax, Bsat, kärnförlust @100Hz/1kHz, resistivitet, TRS, densitet m.m.).

**3. Compare (`/compare`)**
- Sida-vid-sida-jämförelse av upp till 5 grades.
- Radar-diagram, full specifikationstabell, serie-info-popover (1P/3P/5P-förklaring), mest hållbara-markering, **Expert Insights** med **Best Match**.

**4. Contact (`/contact`)**
- Offert-/kontaktformulär som tar med valda material — leadgenerering.

**Genomgående:** Höganäs-identitet, Space Grotesk/Plus Jakarta Sans, Framer Motion-animationer, PDF-broschyrvisning, localStorage som sparar val mellan sidor.

---

## DEL 2 — Vad finns på hoganas.com/sv/.../soft-magnetic-composites/

Den officiella sidan är en **klassisk statisk produktsida**:
- Rubrik + säljande introtext om elektrifieringstrenden.
- Förklaring av vad SMC är + 3 huvudfördelar (Compact, High performance, Cost efficiency).
- En enkel **tabell** med applikationer (Automotive / Industrial) — ren text, inga interaktiva val.
- Länkar till: produkter, Somaloy®, Application development services.
- Kontaktformulär (säljkontakt, landval, Cloudflare-verifiering) + namngiven kontaktperson (Matt Devine).
- Två case-block (Axial flux, Koenigsegg).
- Customer Development Centre + "Full service for electromagnetic applications" (FEA, prototyping).
- Nedladdningsbara PDF:er (Powder Solutions, Axial Flux, DC-DC reactors, Ignition Systems).

**Sammanfattat:** läsa-och-kontakta. Ingen materialväljare, inga poäng, inga jämförelser, ingen data-interaktion.

---

## DEL 3 — Strategisk jämförelse

### Det DU har som hoganas.com INTE har
- **Interaktiv 3-stegs Material Selector** — hoganas har bara textlistor.
- **Poängsatt rekommendationsmotor (0–100)** per material mot kundens behov.
- **Best Match / Expert Insights** — automatiska rekommendationer per applikation.
- **Radar-diagram** som visualiserar egenskaper och behovsprofil.
- **Sida-vid-sida-jämförelse** av upp till 5 grades med full spectabell.
- **Hela materialportföljen samlad** med strukturerad databladsdata (μmax, Bsat, kärnförlust, resistivitet, TRS) — på hoganas ligger detta utspritt i PDF:er.
- **1P/3P/5P-serieförklaring** inbyggd och kontextuell.
- **Hållbarhets-/kostnads-dimension** som väljbart kriterium.

### Det hoganas.com har som du (ännu) INTE har
- **Application development services / Customer Development Centre** (FEA, prototyping, processoptimering) — beskrivs inte på din sida.
- **Namngiven kontaktperson** med direkttelefon/e-post.
- **Komplett PDF-bibliotek** (Powder Solutions, DC-DC reactors, Ignition Systems m.fl.) — du har bara ett urval.
- **Officiell produkt-/Somaloy®-undersida** med Höganäs egna säljtexter.
- **GDPR/personuppgiftspolicy-text** i formuläret.
- Bredare **applikationsexempel** (t.ex. ignition systems) som inte finns som egen app i din väljare.

### Strategisk slutsats
Din app är **konverteringsverktyget hoganas.com saknar**: den tar besökaren från "vad är SMC?" till "detta är rätt grade för mig — kontakta oss". Hoganas.com är informations-/varumärkessidan; din app är beslutsstöd + leadgenerering. De kompletterar varandra snarare än konkurrerar.

---

## DEL 4 — Hur allt jag byggt åt dig fungerar

### A) Material Selector — flödet
1. **Steg 1 (Application):** Användaren väljer en eller flera applikationer + valfri bransch + valfritt "challenge scenario". Varje applikation har en lista `requiredProperties` (de magnetiska egenskaper som spelar roll) och `recommendedMaterials` (Höganäs faktiska rekommendation).
2. **Steg 2 (Requirements):** Apparna sätter automatiskt relevanta egenskaper som "aktiva" och prioritet till minst 70 %. Användaren kan finjustera varje egenskap med en slider (10–100 %). Challenge-scenarier "boostar" specifika egenskaper extra. En sidopanel visar behovsprofilen som radar.
3. **Steg 3 (Results):** Alla material poängsätts och rankas.

### B) Poängsystemet — exakt logik
För varje material:
```
1. För varje AKTIV egenskap:
     bidrag = materialets egenskapsvärde (0-100) × (sliderns prioritet / 100)
2. propertyScore = summa(bidrag) / summa(vikter)   ← viktat medelvärde
3. Om materialet är "recommendedMaterial" för vald app:
     +5 bonuspoäng (bryter oavgjort, men kan inte slå genuint bättre data)
4. score = avrundat, max 100
```
- Inga aktiva egenskaper → neutral baslinje 50.
- Sortering: rekommenderade först, sedan högsta poäng. (Alt. namnsortering.)
- Mest hållbara materialet markeras separat (högst `sustainability` ≥ 65).

**Viktigt (det vi bekräftade tidigare):** poängen är **matematiskt korrekt mot rådatan** i databladen. Den +5-bonus är liten med flit — den styr inte över verklig prestanda.

### C) Radar-diagrammen
- Ritar de relevanta egenskaperna på en 0–100-skala.
- I steg 2: din **behovsprofil**. I Compare: varje materials **faktiska egenskaper** överlagrade.
- Värdena kommer direkt från de normaliserade databladsvärdena i `materials.ts` → diagrammen är korrekta så länge rådatan är korrekt.

### D) Best Match / Expert Insights (Compare-sidan)
- Läser vilka appar användaren valde (sparat i localStorage).
- Tar applikationens `recommendedMaterials` och väljer den med **bäst (lägst) rank** som "Best Match".
- Genererar automatiskt en motivering med riktiga specvärden (μmax, Bsat, kärnförlust) + listar övriga rekommenderade.
- Per material: nyckelstyrkor, applikationer, densitet/partikelstorlek/process.

### E) Det enda kvarvarande beroendet (på era tekniska experter)
Algoritm, radar och poäng är korrekta **mot rådatan**. Den enda öppna punkten är att era tekniska experter validerar att **`recommendedMaterials`-listan per applikation** (alltså "Best Match" och expertrådet) stämmer med er verkliga tekniska rekommendation. När de gett input justerar jag bara den mappningen — ingen omskrivning av logiken behövs.

---

## (Valfritt) Nästa steg jag kan göra om du vill
- Lägga till sektion om **Application Development Services / FEA / prototyping** (matcha hoganas).
- Lägga till **namngiven kontaktperson** + fler PDF:er i biblioteket.
- Lägga till applikationer som finns hos hoganas men inte i väljaren (t.ex. ignition systems).
- Exportera denna genomgång som PDF/sida för intern redovisning.

Detta dokument är genomgången — godkänn om du vill att jag även bygger något av punkterna ovan, annars kan du använda texten direkt för din redovisning.