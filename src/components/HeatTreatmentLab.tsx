import { useMemo, useState } from "react";
import {
  materials,
  motorDesignerApplications,
  propertyLabels,
  type Material,
} from "@/data/materials";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
const simulate = (base: Material["properties"], tempC: number, atm: Atmosphere) => {
  const t = (tempC - 450) / 100; // -0.5 .. +2.0
  const over = Math.max(0, tempC - 550) / 100; // coating degradation above 550 °C

  return {
    permeability: clamp(base.permeability * (1 + 0.08 * t - 0.10 * over) * (atm.strength * 0.5 + 0.5)),
    coreLossLow: clamp(base.coreLossLow * (1 + 0.06 * t - 0.18 * over) * atm.loss),
    coreLossHigh: clamp(base.coreLossHigh * (1 + 0.03 * t - 0.28 * over) * atm.loss),
    saturationInduction: clamp(base.saturationInduction * (1 + 0.01 * t)),
    resistivity: clamp(base.resistivity * (1 - 0.05 * t - 0.30 * over) * atm.resistivity),
    transverseRuptureStrength: clamp(
      base.transverseRuptureStrength * (1 + 0.14 * t - 0.05 * over) * atm.strength
    ),
    compressibility: clamp(base.compressibility),
    densityAchievable: clamp(base.densityAchievable),
    thermalResistance: clamp(base.thermalResistance * (1 + 0.10 * t - 0.12 * over)),
    costEfficiency: clamp(base.costEfficiency * (1 - 0.06 * t)),
    sustainability: clamp(base.sustainability * (1 - 0.03 * t)),
  } as Material["properties"];
};

const propertyOrder = Object.keys(propertyLabels) as PropertyKey[];

const HeatTreatmentLab = () => {
  const [open, setOpen] = useState(false);
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [temp, setTemp] = useState(530);
  const [atmId, setAtmId] = useState("n2");

  const material = materials.find((m) => m.id === materialId) ?? materials[0];
  const atmosphere = atmospheres.find((a) => a.id === atmId) ?? atmospheres[1];

  const simulated = useMemo(
    () => simulate(material.properties, temp, atmosphere),
    [material, temp, atmosphere]
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
          <FlaskConical className="h-3.5 w-3.5 text-accent" />
          Heat Treatment Lab
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
          <DialogTitle>Heat Treatment Lab</DialogTitle>
          <DialogDescription>
            Explore how curing temperature and furnace atmosphere shift the property balance of a
            Somaloy® grade. Values are indicative trends for discussion, not datasheet guarantees.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
                Material
              </p>
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
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                {material.description}
              </p>
              {material.applications?.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Intended applications
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {material.applications.map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
                  Curing temperature
                </p>
                <span className="text-sm font-semibold text-accent">{temp} °C</span>
              </div>
              <Slider
                value={[temp]}
                onValueChange={([v]) => setTemp(v)}
                min={400}
                max={650}
                step={10}
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>400 °C</span>
                <span>Coating limit ≈ 550 °C</span>
                <span>650 °C</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
                Atmosphere
              </p>
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
                      <span
                        className={`font-semibold ${d.delta > 0 ? "text-accent" : "text-destructive"}`}
                      >
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
                  label: `${temp} °C · ${atmosphere.label}`,
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
