import { useMemo, useState } from "react";
import { materials, motorDesignerApplications, propertyLabels, type Material } from "@/data/materials";
import RadarChart from "./RadarChart";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PropertyKey = keyof Material["properties"];

interface Atmosphere {
  id: string;
  label: string;
  note: string;
  /* multiplicative effect factors */
  resistivity: number;
  strength: number;
  loss: number;
}

const atmospheres: Atmosphere[] = [
  {
    id: "air",
    label: "Air",
    note: "Oxidising — builds insulating oxide, favours resistivity over strength.",
    resistivity: 1.06,
    strength: 0.94,
    loss: 1.03,
  },
  {
    id: "n2",
    label: "Nitrogen (N₂)",
    note: "Neutral reference atmosphere for standard Somaloy® curing.",
    resistivity: 1.0,
    strength: 1.0,
    loss: 1.0,
  },
  {
    id: "ar",
    label: "Argon (Ar)",
    note: "Fully inert noble gas — cleanest surfaces, preserves coating integrity at high temperature.",
    resistivity: 1.02,
    strength: 1.03,
    loss: 0.99,
  },
  {
    id: "n2h2",
    label: "N₂ / H₂ (reducing)",
    note: "Reducing — maximises strength and permeability, slight resistivity loss.",
    resistivity: 0.93,
    strength: 1.08,
    loss: 0.98,
  },
  {
    id: "vacuum",
    label: "Vacuum",
    note: "Clean surfaces, stable coating — balanced property set.",
    resistivity: 0.97,
    strength: 1.04,
    loss: 0.99,
  },
];

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

/* ------------------------------------------------------------------
   7P multi-step heat treatment — built directly on the measured trials
   in the internal Höganäs study "Heat treatment optimization of
   7P-components" (2024-11-22, B. Skårman), Somaloy 700 7P @ 7.49 g/cm³.

   Each trial is described by up to three steps:
     1. Air pre-treatment (200–250 °C, 1 h – 4 days)
     2. Delubrication (≈ 450 °C, 20–30 min, atmosphere 0–1 % O₂)
     3. Curing (600–625 °C, 20–40 min, 0.5–1.5 % O₂)

   Values between the measured trials are inverse-distance interpolated,
   and an exact parameter match is reported with its trial letter.
   Trials J (post-treatment) and Q (direct transfer) are excluded as they
   use process variants outside this three-step configurator.
------------------------------------------------------------------- */
interface StepPre {
  t: number;
  h: number;
}
interface StepDelub {
  t: number;
  min: number;
  o2: number;
}
interface StepCure {
  t: number;
  min: number;
  o2: number;
}
interface Trial {
  id: string;
  pre?: StepPre;
  delub?: StepDelub;
  cure: StepCure;
  trs: number;
  rho: number;
  mumax: number;
  hc: number;
  cl400: number;
  cl1k: number;
  b10: number;
}

const trials: Trial[] = [
  { id: "Ref", cure: { t: 615, min: 20, o2: 1.0 }, trs: 62, rho: 14562, mumax: 528, hc: 135, cl400: 28.1, cl1k: 82.1, b10: 1.58 },
  { id: "A", delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 0.5 }, trs: 99, rho: 2576, mumax: 515, hc: 134, cl400: 28.7, cl1k: 84.3, b10: 1.57 },
  { id: "B", pre: { t: 220, h: 18 }, cure: { t: 615, min: 20, o2: 0 }, trs: 68, rho: 891, mumax: 517, hc: 132, cl400: 27.9, cl1k: 81.8, b10: 1.58 },
  { id: "C", pre: { t: 250, h: 1 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 0.5 }, trs: 92, rho: 5844, mumax: 527, hc: 133, cl400: 28.4, cl1k: 83.2, b10: 1.57 },
  { id: "D", pre: { t: 250, h: 1 }, delub: { t: 450, min: 20, o2: 1.0 }, cure: { t: 625, min: 20, o2: 0.5 }, trs: 100, rho: 13894, mumax: 423, hc: 147, cl400: 29.8, cl1k: 87.2, b10: 1.54 },
  { id: "E", pre: { t: 220, h: 18 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 0.5 }, trs: 113, rho: 5683, mumax: 514, hc: 133, cl400: 28.3, cl1k: 83.3, b10: 1.57 },
  { id: "F", pre: { t: 220, h: 18 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 1.5 }, trs: 123, rho: 4017, mumax: 506, hc: 135, cl400: 28.7, cl1k: 84.3, b10: 1.57 },
  { id: "G", pre: { t: 220, h: 2 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 1.5 }, trs: 117, rho: 3622, mumax: 506, hc: 141, cl400: 29.5, cl1k: 85.9, b10: 1.57 },
  { id: "H", pre: { t: 210, h: 30 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 1.5 }, trs: 141, rho: 4545, mumax: 482, hc: 147, cl400: 30.3, cl1k: 88.0, b10: 1.57 },
  { id: "I", pre: { t: 220, h: 18 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 600, min: 40, o2: 1.5 }, trs: 105, rho: 5020, mumax: 487, hc: 136, cl400: 29.1, cl1k: 85.1, b10: 1.56 },
  { id: "K", delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 1.5 }, trs: 109, rho: 2556, mumax: 502, hc: 135, cl400: 28.8, cl1k: 84.5, b10: 1.56 },
  { id: "L", pre: { t: 250, h: 1 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 1.5 }, trs: 124, rho: 2970, mumax: 511, hc: 141, cl400: 29.6, cl1k: 86.4, b10: 1.57 },
  { id: "M", pre: { t: 200, h: 96 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 615, min: 20, o2: 1.5 }, trs: 124, rho: 2766, mumax: 471, hc: 135, cl400: 28.8, cl1k: 84.8, b10: 1.56 },
  { id: "N", pre: { t: 220, h: 18 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 605, min: 20, o2: 1.5 }, trs: 119, rho: 4255, mumax: 487, hc: 138, cl400: 29.2, cl1k: 85.4, b10: 1.57 },
  { id: "O", pre: { t: 220, h: 18 }, delub: { t: 450, min: 30, o2: 0 }, cure: { t: 600, min: 40, o2: 0.5 }, trs: 103, rho: 5821, mumax: 487, hc: 139, cl400: 29.3, cl1k: 85.5, b10: 1.57 },
  { id: "P", delub: { t: 450, min: 30, o2: 0.1 }, cure: { t: 615, min: 20, o2: 1.5 }, trs: 91, rho: 3417, mumax: 497, hc: 132, cl400: 28.3, cl1k: 83.3, b10: 1.57 },
];

const REF = trials[0];

export interface Recipe {
  preOn: boolean;
  preT: number;
  preH: number;
  delubOn: boolean;
  delubT: number;
  delubMin: number;
  delubO2: number;
  cureT: number;
  cureMin: number;
  cureO2: number;
}

const featureWeights = [2.5, 1.5, 1.0, 3.0, 1.5, 1.0, 3.0, 3.0, 1.5, 2.0];

const featuresOf = (r: Recipe) => [
  r.preOn ? 1 : 0,
  r.preOn ? r.preT / 100 : 0,
  r.preOn ? Math.log(1 + r.preH) : 0,
  r.delubOn ? 1 : 0,
  r.delubOn ? r.delubT / 100 : 0,
  r.delubOn ? r.delubMin / 30 : 0,
  r.delubOn ? r.delubO2 : 0,
  r.cureT / 100,
  r.cureMin / 20,
  r.cureO2,
];

const trialToRecipe = (t: Trial): Recipe => ({
  preOn: !!t.pre,
  preT: t.pre?.t ?? 220,
  preH: t.pre?.h ?? 18,
  delubOn: !!t.delub,
  delubT: t.delub?.t ?? 450,
  delubMin: t.delub?.min ?? 30,
  delubO2: t.delub?.o2 ?? 0,
  cureT: t.cure.t,
  cureMin: t.cure.min,
  cureO2: t.cure.o2,
});

/* Standard single-step heat treatment — the datasheet reference cycle (trial Ref). */
const standard7P: Recipe = {
  preOn: false,
  preT: 220,
  preH: 18,
  delubOn: false,
  delubT: 450,
  delubMin: 30,
  delubO2: 0,
  cureT: 615,
  cureMin: 20,
  cureO2: 1.0,
};

/* Recommended cycles for a given property target — taken straight from the
   measured trials in the 7P heat treatment study. */
interface Goal {
  id: string;
  label: string;
  target: string;
  trial: string;
  recipe: Recipe;
}

const goals: Goal[] = [
  {
    id: "trs-max",
    label: "Maximum strength",
    target: "TRS 141 MPa (trial H) — highest measured strength",
    trial: "H",
    recipe: { preOn: true, preT: 210, preH: 30, delubOn: true, delubT: 450, delubMin: 30, delubO2: 0, cureT: 615, cureMin: 20, cureO2: 1.5 },
  },
  {
    id: "trs-fast",
    label: "High strength, short cycle",
    target: "TRS 124 MPa (trial L) — only 1 h pre-treatment",
    trial: "L",
    recipe: { preOn: true, preT: 250, preH: 1, delubOn: true, delubT: 450, delubMin: 30, delubO2: 0, cureT: 615, cureMin: 20, cureO2: 1.5 },
  },
  {
    id: "balanced",
    label: "Strength + magnetics balance",
    target: "TRS 113 MPa, μmax 514, 28.3 W/kg (trial E)",
    trial: "E",
    recipe: { preOn: true, preT: 220, preH: 18, delubOn: true, delubT: 450, delubMin: 30, delubO2: 0, cureT: 615, cureMin: 20, cureO2: 0.5 },
  },
  {
    id: "no-pre",
    label: "Strength without pre-treatment",
    target: "TRS 109 MPa (trial K) — 2-step production friendly",
    trial: "K",
    recipe: { preOn: false, preT: 220, preH: 18, delubOn: true, delubT: 450, delubMin: 30, delubO2: 0, cureT: 615, cureMin: 20, cureO2: 1.5 },
  },
  {
    id: "resistivity",
    label: "Maximum resistivity / lowest loss",
    target: "14,562 μΩ·m, μmax 528, 28.1 W/kg (Ref, single step)",
    trial: "Ref",
    recipe: { preOn: false, preT: 220, preH: 18, delubOn: false, delubT: 450, delubMin: 30, delubO2: 0, cureT: 615, cureMin: 20, cureO2: 1.0 },
  },
  {
    id: "hybrid",
    label: "High strength + high resistivity",
    target: "TRS 100 MPa, 13,894 μΩ·m (trial D)",
    trial: "D",
    recipe: { preOn: true, preT: 250, preH: 1, delubOn: true, delubT: 450, delubMin: 20, delubO2: 1.0, cureT: 625, cureMin: 20, cureO2: 0.5 },
  },
];


/* Inverse-distance interpolation between the measured trials. */
const predict7P = (recipe: Recipe) => {
  const f = featuresOf(recipe);
  const scored = trials.map((t) => {
    const g = featuresOf(trialToRecipe(t));
    const d = Math.sqrt(f.reduce((s, v, i) => s + featureWeights[i] * (v - g[i]) ** 2, 0));
    return { t, d };
  });
  scored.sort((a, b) => a.d - b.d);
  const exact = scored[0].d < 0.02 ? scored[0].t : null;

  const near = scored.slice(0, 4);
  let wSum = 0;
  const acc = { trs: 0, rho: 0, mumax: 0, hc: 0, cl400: 0, cl1k: 0, b10: 0 };
  near.forEach(({ t, d }) => {
    const w = 1 / Math.pow(d + 0.06, 4);
    wSum += w;
    acc.trs += w * t.trs;
    acc.rho += w * t.rho;
    acc.mumax += w * t.mumax;
    acc.hc += w * t.hc;
    acc.cl400 += w * t.cl400;
    acc.cl1k += w * t.cl1k;
    acc.b10 += w * t.b10;
  });

  return {
    exact,
    closest: scored[0].t,
    trs: acc.trs / wSum,
    rho: acc.rho / wSum,
    mumax: acc.mumax / wSum,
    hc: acc.hc / wSum,
    cl400: acc.cl400 / wSum,
    cl1k: acc.cl1k / wSum,
    b10: acc.b10 / wSum,
  };
};

/* Map the predicted measured values onto the 0–100 property scale,
   relative to the standard single-step reference (Ref). */
const simulate7P = (base: Material["properties"], recipe: Recipe, p: ReturnType<typeof predict7P>) => {
  const steps = (recipe.preOn ? 1 : 0) + (recipe.delubOn ? 1 : 0) + 1;
  const totalHours = (recipe.preOn ? recipe.preH : 0) + (recipe.delubOn ? recipe.delubMin / 60 : 0) + recipe.cureMin / 60;

  return {
    permeability: clamp(base.permeability * (p.mumax / REF.mumax)),
    coreLossLow: clamp(base.coreLossLow * (REF.cl400 / p.cl400)),
    coreLossHigh: clamp(base.coreLossHigh * (REF.cl1k / p.cl1k)),
    saturationInduction: clamp(base.saturationInduction * (p.b10 / REF.b10)),
    resistivity: clamp(base.resistivity * (1 + 0.45 * Math.log10(p.rho / REF.rho))),
    transverseRuptureStrength: clamp(base.transverseRuptureStrength * (p.trs / REF.trs)),
    compressibility: clamp(base.compressibility),
    densityAchievable: clamp(base.densityAchievable),
    thermalResistance: clamp(base.thermalResistance),
    costEfficiency: clamp(base.costEfficiency * (1 - 0.05 * (steps - 1) - 0.0015 * totalHours)),
    sustainability: clamp(base.sustainability * (1 - 0.0012 * totalHours)),
  } as Material["properties"];
};


/* Simplified curing model: strength increases with temperature,
   coating resistivity degrades above the coating limit. */
const simulate = (base: Material["properties"], tempC: number, atm: Atmosphere, oxygenPpm: number) => {
  const t = (tempC - 450) / 100; // -0.5 .. +3.5 across 400–800 °C
  const over = Math.max(0, tempC - 550) / 100; // coating degradation above 550 °C
  const ox = oxygenPpm / 4000; // residual oxygen effect, 0 .. +3.0 across 0–12000 ppm

  return {
    permeability: clamp(base.permeability * (1 + 0.08 * t - 0.1 * over - 0.02 * ox) * (atm.strength * 0.5 + 0.5)),
    coreLossLow: clamp(base.coreLossLow * (1 + 0.06 * t - 0.18 * over) * atm.loss * (1 + 0.01 * ox)),
    coreLossHigh: clamp(base.coreLossHigh * (1 + 0.03 * t - 0.28 * over) * atm.loss * (1 + 0.015 * ox)),
    saturationInduction: clamp(base.saturationInduction * (1 + 0.01 * t - 0.01 * ox)),
    resistivity: clamp(base.resistivity * (1 - 0.05 * t - 0.3 * over) * atm.resistivity * (1 + 0.03 * ox)),
    transverseRuptureStrength: clamp(
      base.transverseRuptureStrength * (1 + 0.14 * t - 0.05 * over - 0.04 * ox) * atm.strength,
    ),
    compressibility: clamp(base.compressibility),
    densityAchievable: clamp(base.densityAchievable),
    thermalResistance: clamp(base.thermalResistance * (1 + 0.1 * t - 0.12 * over)),
    costEfficiency: clamp(base.costEfficiency * (1 - 0.06 * t)),
    sustainability: clamp(base.sustainability * (1 - 0.03 * t)),
  } as Material["properties"];
};

const propertyOrder = Object.keys(propertyLabels) as PropertyKey[];

/* Applications are taken from the same curated Material Selector mapping,
   so the lab always shows the correct grade → application relations. */
const applicationsForMaterial = (materialId: string) =>
  motorDesignerApplications
    .map((app) => {
      const rank = app.recommendedGroups.findIndex((g) => g.includes(materialId));
      return rank === -1 ? null : { name: app.name, rank: rank + 1 };
    })
    .filter((a): a is { name: string; rank: number } => a !== null)
    .sort((a, b) => a.rank - b.rank);

/* Only 7P materials are available in the lab — these are the only grades
   backed by measured heat-treatment data so far. */
const sevenPMaterials = materials.filter((m) => m.category.includes("7P"));

const HeatTreatmentLab = () => {
  const [open, setOpen] = useState(false);
  const [materialId, setMaterialId] = useState(sevenPMaterials[0]?.id ?? "");
  const [recipe, setRecipe] = useState<Recipe>({
    preOn: true,
    preT: 220,
    preH: 18,
    delubOn: true,
    delubT: 450,
    delubMin: 30,
    delubO2: 0,
    cureT: 615,
    cureMin: 20,
    cureO2: 1.5,
  });
  const [mode7P, setMode7P] = useState<"standard" | "custom">("standard");

  const material = sevenPMaterials.find((m) => m.id === materialId) ?? sevenPMaterials[0];
  const appMatches = useMemo(() => applicationsForMaterial(material.id), [material]);

  const effectiveRecipe = mode7P === "standard" ? standard7P : recipe;
  const prediction = useMemo(() => predict7P(effectiveRecipe), [effectiveRecipe]);
  const setR = (patch: Partial<Recipe>) => setRecipe((r) => ({ ...r, ...patch }));

  const simulated = useMemo(
    () => simulate7P(material.properties, effectiveRecipe, prediction),
    [material, effectiveRecipe, prediction],
  );


  const deltas = propertyOrder
    .map((key) => ({ key, delta: simulated[key] - material.properties[key] }))
    .filter((d) => Math.abs(d.delta) >= 2)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 4);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground">
          Heat Treatment
          <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-secondary-foreground">
            Preview
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-[0.12em]">
              Future feature — indicative model
            </Badge>
          </div>
          <DialogTitle>Heat Treatment</DialogTitle>
          <DialogDescription>
            Explore how temperature and furnace atmosphere shift the property balance of a Somaloy® grade. Values are
            indicative trends for discussion, not datasheet guarantees.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Material</p>
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {materials.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{material.description}</p>
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Recommended for these applications
                </p>
                {appMatches.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {appMatches.map((a) => (
                      <span
                        key={a.name}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                      >
                        {a.name}
                        <span className="rounded-full bg-background px-1.5 text-[9px] font-bold text-accent">
                          {a.rank}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Not part of a recommended shortlist in the Material Selector — typical use:{" "}
                    {material.applications.join(", ")}.
                  </p>
                )}
                <p className="mt-1.5 text-[10px] text-muted-foreground/70">
                  Same ranking as the Material Selector (1 = first recommendation).
                </p>
              </div>
            </div>

            {is7P ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
                    Heat treatment — 7P
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {mode7P === "standard"
                      ? "Standard single-step cycle"
                      : `${(recipe.preOn ? 1 : 0) + (recipe.delubOn ? 1 : 0) + 1}-step cycle`}
                  </span>
                </div>

                {/* Mode: standard datasheet cycle vs. custom multi-step */}
                <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-secondary p-1.5">
                  <button
                    type="button"
                    onClick={() => setMode7P("standard")}
                    className={`rounded-md px-3 py-2 text-left transition-colors ${
                      mode7P === "standard" ? "bg-background shadow-sm" : "hover:bg-background/50"
                    }`}
                  >
                    <span className="block text-[12px] font-semibold text-foreground">Standard</span>
                    <span className="block text-[10px] text-muted-foreground">Datasheet cycle · 615 °C / 20 min / 1 % O₂</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode7P("custom")}
                    className={`rounded-md px-3 py-2 text-left transition-colors ${
                      mode7P === "custom" ? "bg-background shadow-sm" : "hover:bg-background/50"
                    }`}
                  >
                    <span className="block text-[12px] font-semibold text-foreground">Custom multi-step</span>
                    <span className="block text-[10px] text-muted-foreground">Pre-treatment + delubrication + curing</span>
                  </button>
                </div>

                {mode7P === "standard" && (
                  <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-[12px] font-semibold text-foreground">Standard heat treatment (datasheet)</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      Single-step curing at 615 °C for 20 minutes in 1 % O₂ — the reference cycle the Somaloy 700 7P
                      datasheet values are measured with (trial Ref in the 7P heat treatment study). Switch to Custom
                      multi-step to explore optimized cycles with higher strength.
                    </p>
                  </div>
                )}


                {mode7P === "custom" && (
                  <>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Recommended cycles — pick a property target
                  </p>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                    {goals.map((g) => {
                      const active = prediction.exact?.id === g.trial;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setRecipe(g.recipe)}
                          className={`rounded-md border p-2.5 text-left transition-colors ${
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:border-primary/50"
                          }`}
                        >
                          <span className="block text-[12px] font-semibold text-foreground">{g.label}</span>
                          <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                            {g.target}
                          </span>
                          <span className="mt-1 block text-[10px] font-medium text-primary">
                            {g.recipe.preOn ? `Air ${g.recipe.preT} °C / ${g.recipe.preH} h → ` : ""}
                            {g.recipe.delubOn
                              ? `${g.recipe.delubT} °C / ${g.recipe.delubMin} min / ${
                                  g.recipe.delubO2 === 0 ? "100 % N₂" : `${g.recipe.delubO2} % O₂`
                                } → `
                              : ""}
                            {g.recipe.cureT} °C / {g.recipe.cureMin} min / {g.recipe.cureO2} % O₂
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground/70">
                    All settings are measured trials from the internal 7P heat treatment study (Somaloy 700 7P @ 7.49
                    g/cm³). Adjust the steps below to explore values in between.
                  </p>
                </div>



                {/* Step 1 — air pre-treatment */}
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-foreground">Step 1 · Air pre-treatment</p>
                    <button
                      onClick={() => setR({ preOn: !recipe.preOn })}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                        recipe.preOn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {recipe.preOn ? "On" : "Off"}
                    </button>
                  </div>
                  {recipe.preOn && (
                    <>
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Temperature</span>
                        <span className="font-semibold text-accent">{recipe.preT} °C</span>
                      </div>
                      <Slider
                        value={[recipe.preT]}
                        onValueChange={([v]) => setR({ preT: v })}
                        min={200}
                        max={250}
                        step={10}
                      />
                      <p className="mb-3 mt-1 text-[10px] text-muted-foreground">Study range 200–250 °C in air.</p>
                      <p className="mb-1.5 text-[11px] text-muted-foreground">Hold time</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[1, 2, 18, 30, 96].map((h) => (
                          <button
                            key={h}
                            onClick={() => setR({ preH: h })}
                            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                              recipe.preH === h
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {h === 96 ? "4 days" : `${h} h`}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Step 2 — delubrication */}
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-foreground">Step 2 · Delubrication</p>
                    <button
                      onClick={() => setR({ delubOn: !recipe.delubOn })}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                        recipe.delubOn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {recipe.delubOn ? "On" : "Off"}
                    </button>
                  </div>
                  {recipe.delubOn && (
                    <>
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Temperature</span>
                        <span className="font-semibold text-accent">{recipe.delubT} °C</span>
                      </div>
                      <Slider
                        value={[recipe.delubT]}
                        onValueChange={([v]) => setR({ delubT: v })}
                        min={400}
                        max={500}
                        step={10}
                      />
                      <div className="mb-1 mt-3 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Hold time</span>
                        <span className="font-semibold text-accent">{recipe.delubMin} min</span>
                      </div>
                      <Slider
                        value={[recipe.delubMin]}
                        onValueChange={([v]) => setR({ delubMin: v })}
                        min={20}
                        max={30}
                        step={5}
                      />
                      <p className="mb-1.5 mt-3 text-[11px] text-muted-foreground">Atmosphere</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { v: 0, label: "100 % N₂" },
                          { v: 0.1, label: "0.1 % O₂" },
                          { v: 1.0, label: "1 % O₂" },
                        ].map((o) => (
                          <button
                            key={o.v}
                            onClick={() => setR({ delubO2: o.v })}
                            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                              recipe.delubO2 === o.v
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1.5 text-[10px] text-muted-foreground">
                        Oxygen at 300–450 °C oxidises the base powder before the coating is formed — inert gas gives the
                        highest strength.
                      </p>
                    </>
                  )}
                </div>

                {/* Step 3 — curing */}
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="mb-2 text-[12px] font-semibold text-foreground">Step 3 · Curing</p>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-semibold text-accent">{recipe.cureT} °C</span>
                  </div>
                  <Slider
                    value={[recipe.cureT]}
                    onValueChange={([v]) => setR({ cureT: v })}
                    min={600}
                    max={625}
                    step={5}
                  />
                  <div className="mb-1 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Hold time</span>
                    <span className="font-semibold text-accent">{recipe.cureMin} min</span>
                  </div>
                  <Slider
                    value={[recipe.cureMin]}
                    onValueChange={([v]) => setR({ cureMin: v })}
                    min={20}
                    max={40}
                    step={10}
                  />
                  <p className="mb-1.5 mt-3 text-[11px] text-muted-foreground">Oxygen content</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { v: 0, label: "100 % N₂" },
                      { v: 0.5, label: "0.5 % O₂" },
                      { v: 1.0, label: "1 % O₂" },
                      { v: 1.5, label: "1.5 % O₂" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        onClick={() => setR({ cureO2: o.v })}
                        className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                          recipe.cureO2 === o.v
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
                  </>
                )}

                {/* Predicted measured values */}
                <div className="rounded-xl border border-border bg-secondary/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Predicted values — Somaloy 700 7P @ 7.49 g/cm³
                    </p>
                    <Badge variant="secondary" className="text-[9px] uppercase tracking-[0.1em]">
                      {prediction.exact ? `Trial ${prediction.exact.id}` : `≈ Trial ${prediction.closest.id}`}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TRS</span>
                      <span className="font-semibold">{Math.round(prediction.trs)} MPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resistivity</span>
                      <span className="font-semibold">{Math.round(prediction.rho).toLocaleString()} μΩ·m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">μmax</span>
                      <span className="font-semibold">{Math.round(prediction.mumax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hc @ 10 kA/m</span>
                      <span className="font-semibold">{Math.round(prediction.hc)} A/m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loss 1T/400 Hz</span>
                      <span className="font-semibold">{prediction.cl400.toFixed(1)} W/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loss 1T/1 kHz</span>
                      <span className="font-semibold">{prediction.cl1k.toFixed(1)} W/kg</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {prediction.exact
                      ? `Exact match with measured trial ${prediction.exact.id} in the 7P heat treatment study.`
                      : `Interpolated between the measured trials, closest to trial ${prediction.closest.id}. Reference (single-step 615 °C, 20 min, 1 % O₂): TRS 62 MPa.`}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
                      Curing temperature
                    </p>
                    <span className="text-sm font-semibold text-accent">{temp} °C</span>
                  </div>
                  <Slider value={[temp]} onValueChange={([v]) => setTemp(v)} min={400} max={800} step={10} />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>400 °C</span>
                    <span>Coating limit ≈ 550 °C</span>
                    <span>800 °C</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
                      Residual oxygen in atmosphere
                    </p>
                    <span className="text-sm font-semibold text-accent">{oxygenPpm} ppm</span>
                  </div>
                  <Slider value={[oxygenPpm]} onValueChange={([v]) => setOxygenPpm(v)} min={0} max={12000} step={50} />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>0 ppm (very clean)</span>
                    <span>12000 ppm (oxidising)</span>
                  </div>
                </div>
              </>
            )}


            {!is7P && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Atmosphere</p>
                <div className="flex flex-wrap gap-1.5">
                  {atmospheres.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAtmId(a.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        a.id === atmId
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{atmosphere.note}</p>
              </div>
            )}


            {deltas.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Main shifts vs. standard profile
                </p>
                <div className="space-y-1.5">
                  {deltas.map((d) => (
                    <div key={d.key} className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">{propertyLabels[d.key].label}</span>
                      <span className={`font-semibold ${d.delta > 0 ? "text-accent" : "text-destructive"}`}>
                        {d.delta > 0 ? "+" : ""}
                        {d.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Property profile
            </p>
            <RadarChart
              size={248}
              labels={propertyOrder.map((k) => propertyLabels[k].label)}
              datasets={[
                {
                  label: "Standard",
                  data: propertyOrder.map((k) => material.properties[k]),
                  color: "hsl(213, 12%, 48%)",
                },
                {
                  label: is7P
                    ? mode7P === "standard"
                      ? "Standard · 615 °C / 20 min / 1 % O₂"
                      : `${(recipe.preOn ? 1 : 0) + (recipe.delubOn ? 1 : 0) + 1}-step · ${recipe.cureT} °C / ${recipe.cureMin} min / ${recipe.cureO2} % O₂`
                    : `${temp} °C · ${atmosphere.label} · ${oxygenPpm} ppm O₂`,
                  data: propertyOrder.map((k) => simulated[k]),
                  color: "hsl(210, 85%, 25%)",
                },
              ]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeatTreatmentLab;
