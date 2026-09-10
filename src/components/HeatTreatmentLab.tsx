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

const HeatTreatmentLab = () => {
  const [open, setOpen] = useState(false);
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [temp, setTemp] = useState(530);
  const [atmId, setAtmId] = useState("n2");
  const [oxygenPpm, setOxygenPpm] = useState(100);

  const material = materials.find((m) => m.id === materialId) ?? materials[0];
  const atmosphere = atmospheres.find((a) => a.id === atmId) ?? atmospheres[1];
  const appMatches = useMemo(() => applicationsForMaterial(material.id), [material]);

  const simulated = useMemo(
    () => simulate(material.properties, temp, atmosphere, oxygenPpm),
    [material, temp, atmosphere, oxygenPpm],
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

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Curing temperature</p>
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
                  label: `${temp} °C · ${atmosphere.label} · ${oxygenPpm} ppm O₂`,
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
