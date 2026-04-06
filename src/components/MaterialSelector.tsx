import { useState, useMemo } from "react";
import { materials, propertyLabels, type Material } from "@/data/materials";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import MaterialCard from "./MaterialCard";
import RadarChart from "./RadarChart";
import { SlidersHorizontal, Sparkles, RotateCcw } from "lucide-react";

type PropertyKey = keyof Material["properties"];

interface PropertyWeight {
  key: PropertyKey;
  value: number;
  active: boolean;
}

const defaultWeights: PropertyWeight[] = [
  { key: "permeability", value: 50, active: false },
  { key: "coreLossLow", value: 50, active: false },
  { key: "coreLossHigh", value: 50, active: false },
  { key: "saturationInduction", value: 50, active: false },
  { key: "resistivity", value: 50, active: false },
  { key: "transverseRuptureStrength", value: 50, active: false },
  { key: "compressibility", value: 50, active: false },
  { key: "densityAchievable", value: 50, active: false },
  { key: "thermalResistance", value: 50, active: false },
  { key: "costEfficiency", value: 50, active: false },
  { key: "sustainability", value: 50, active: false },
];

interface MaterialSelectorProps {
  onCompare: (material: Material) => void;
  compareList: Material[];
}

const MaterialSelector = ({ onCompare, compareList }: MaterialSelectorProps) => {
  const [weights, setWeights] = useState<PropertyWeight[]>(defaultWeights);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  const activeWeights = weights.filter((w) => w.active);
  const hasActiveFilters = activeWeights.length > 0;

  const scoredMaterials = useMemo(() => {
    if (!hasActiveFilters) return materials.map((m) => ({ material: m, score: 0 }));

    return materials
      .map((material) => {
        let totalScore = 0;
        let totalWeight = 0;
        activeWeights.forEach((w) => {
          const propValue = material.properties[w.key];
          const weight = w.value / 100;
          totalScore += propValue * weight;
          totalWeight += weight;
        });
        const score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
        return { material, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [weights, hasActiveFilters, activeWeights]);

  const filteredMaterials = brandFilter
    ? scoredMaterials.filter((s) => s.material.brand === brandFilter)
    : scoredMaterials;

  const updateWeight = (key: PropertyKey, value: number) => {
    setWeights((prev) =>
      prev.map((w) => (w.key === key ? { ...w, value, active: true } : w))
    );
  };

  const toggleActive = (key: PropertyKey) => {
    setWeights((prev) =>
      prev.map((w) => (w.key === key ? { ...w, active: !w.active } : w))
    );
  };

  const resetWeights = () => setWeights(defaultWeights);

  const brands = ["Astaloy", "Distaloy", "Somaloy", "Stainless", "ToolSteel", "FeCrAl", "Other"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero section */}
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            Egenskapsdriven AI-matchning
          </span>
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hitta rätt material
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          Ställ in de egenskaper du behöver och se vilka Höganäs-material som matchar bäst.
          Prioritera med sliders och jämför sida vid sida.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Property panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Välj egenskaper
            </div>
            {hasActiveFilters && (
              <button onClick={resetWeights} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <RotateCcw className="h-3 w-3" />
                Återställ
              </button>
            )}
          </div>

          <div className="space-y-1 rounded-xl border border-border bg-card p-4 hoganas-shadow">
            {weights.map((w) => (
              <div key={w.key} className="group">
                <button
                  onClick={() => toggleActive(w.key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                    w.active
                      ? "bg-primary/5 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{propertyLabels[w.key].label}</span>
                  {w.active && (
                    <Badge variant="secondary" className="text-xs">
                      {w.value}%
                    </Badge>
                  )}
                </button>
                {w.active && (
                  <div className="px-3 pb-3">
                    <Slider
                      value={[w.value]}
                      onValueChange={([v]) => updateWeight(w.key, v)}
                      min={10}
                      max={100}
                      step={5}
                      className="mt-1"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {propertyLabels[w.key].description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Brand filter */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filtrera per varumärke
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setBrandFilter(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  !brandFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Alla
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(brandFilter === b ? null : b)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    brandFilter === b
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {b === "ToolSteel" ? "Tool Steel" : b === "FeCrAl" ? "FeCrAl" : b}
                  {b === "Astaloy" || b === "Distaloy" ? "®" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Radar chart of ideal profile */}
          {hasActiveFilters && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Din ideala profil
              </p>
              <RadarChart
                datasets={[
                  {
                    label: "Dina krav",
                    data: Object.keys(propertyLabels).map((key) => {
                      const w = weights.find((wt) => wt.key === key);
                      return w?.active ? w.value : 0;
                    }),
                    color: "hsl(200, 75%, 40%)",
                  },
                  ...(filteredMaterials.length > 0
                    ? [
                        {
                          label: filteredMaterials[0].material.name,
                          data: Object.keys(propertyLabels).map(
                            (key) => filteredMaterials[0].material.properties[key as PropertyKey]
                          ),
                          color: "hsl(210, 85%, 25%)",
                        },
                      ]
                    : []),
                ]}
                labels={Object.values(propertyLabels).map((p) => p.label)}
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredMaterials.length}</span> material
              {hasActiveFilters && " • Sorterat efter matchning"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredMaterials.map(({ material, score }) => (
              <MaterialCard
                key={material.id}
                material={material}
                score={hasActiveFilters ? score : undefined}
                onCompare={() => onCompare(material)}
                isInCompare={compareList.some((c) => c.id === material.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialSelector;
