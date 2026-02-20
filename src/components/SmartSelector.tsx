import { useState, useMemo, useCallback } from "react";
import {
  materials,
  propertyLabels,
  technologyAreas,
  applications,
  industries,
  type Material,
  type TechnologyArea,
} from "@/data/materials";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import MaterialCard from "./MaterialCard";
import RadarChart from "./RadarChart";
import {
  SlidersHorizontal,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Layers,
  Target,
  Filter,
  ArrowUpDown,
  X,
  Check,
  BarChart3,
  Sparkles,
  Info,
} from "lucide-react";
import heroPowder from "@/assets/hero-powder.jpg";

// Technology images
import techPressSinter from "@/assets/tech-pressing-sintering.jpg";
import techSoftMag from "@/assets/tech-soft-magnetics.jpg";
import techAM from "@/assets/tech-additive-manufacturing.jpg";
import techCoating from "@/assets/tech-surface-coating.jpg";
import techBrazing from "@/assets/tech-brazing.jpg";
import techFriction from "@/assets/tech-friction.jpg";
import techMIM from "@/assets/tech-mim.jpg";

// Industry images
import indAutomotive from "@/assets/ind-automotive.jpg";
import indAerospace from "@/assets/ind-aerospace.jpg";
import indConstruction from "@/assets/ind-construction.jpg";
import indEnergy from "@/assets/ind-energy.jpg";
import indProcessing from "@/assets/ind-processing.jpg";
import indMedical from "@/assets/ind-medical.jpg";
import indConsumer from "@/assets/ind-consumer.jpg";
import indElectronics from "@/assets/ind-electronics.jpg";

type PropertyKey = keyof Material["properties"];

interface PropertyWeight {
  key: PropertyKey;
  value: number;
  active: boolean;
}

const allPropertyKeys = Object.keys(propertyLabels) as PropertyKey[];

const createDefaultWeights = (): PropertyWeight[] =>
  allPropertyKeys.map((key) => ({ key, value: 50, active: false }));

interface SmartSelectorProps {
  onCompare: (material: Material) => void;
  compareList: Material[];
}

type Step = "technology" | "application" | "properties" | "results";

const techImages: Record<string, string> = {
  "pressing-sintering": techPressSinter,
  "soft-magnetics": techSoftMag,
  "additive-manufacturing": techAM,
  "surface-coating": techCoating,
  "brazing": techBrazing,
  "friction": techFriction,
  "metal-injection-molding": techMIM,
};

const industryImages: Record<string, string> = {
  automotive: indAutomotive,
  aerospace: indAerospace,
  construction: indConstruction,
  energy: indEnergy,
  processing: indProcessing,
  medical: indMedical,
  electronics: indElectronics,
  consumer: indConsumer,
};

// Interpolate a percentage (10-100) to a real engineering value range
const interpolateValue = (pct: number, range: [number, number]): string => {
  const [min, max] = range;
  const val = min + (pct / 100) * (max - min);
  // Smart formatting based on magnitude
  if (max < 5) return val.toFixed(2);
  if (max < 100) return val.toFixed(1);
  return Math.round(val).toString();
};

const SmartSelector = ({ onCompare, compareList }: SmartSelectorProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("technology");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [weights, setWeights] = useState<PropertyWeight[]>(createDefaultWeights());
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "name" | "brand">("score");

  const steps: { id: Step; label: string; num: number }[] = [
    { id: "technology", label: "Technology", num: 1 },
    { id: "application", label: "Application", num: 2 },
    { id: "properties", label: "Requirements", num: 3 },
    { id: "results", label: "Results", num: 4 },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  // Check if SMC is selected
  const isSMCSelected = selectedTech.includes("soft-magnetics");

  // Determine relevant properties based on selections
  const relevantPropertyKeys = useMemo((): PropertyKey[] => {
    const propSet = new Set<PropertyKey>();

    if (selectedTech.length > 0) {
      selectedTech.forEach((techId) => {
        const tech = technologyAreas.find((t) => t.id === techId);
        tech?.relevantProperties.forEach((p) => propSet.add(p));
      });
    }

    if (selectedApps.length > 0) {
      selectedApps.forEach((appId) => {
        const app = applications.find((a) => a.id === appId);
        app?.requiredProperties.forEach((p) => propSet.add(p));
      });
    }

    if (propSet.size === 0) return allPropertyKeys;
    return allPropertyKeys.filter((k) => propSet.has(k));
  }, [selectedTech, selectedApps]);

  const filteredApps = useMemo(() => {
    if (selectedTech.length === 0) return applications;
    return applications.filter((a) =>
      a.technologyAreas.some((t) => selectedTech.includes(t))
    );
  }, [selectedTech]);

  const availableChallenges = useMemo(() => {
    if (selectedApps.length === 0) return [];
    return applications
      .filter((a) => selectedApps.includes(a.id))
      .flatMap((a) => a.challengeScenarios);
  }, [selectedApps]);

  const applyApplicationWeights = useCallback(() => {
    const selectedAppObjects = applications.filter((a) => selectedApps.includes(a.id));
    const challenge = availableChallenges.find((c) => c.id === selectedChallenge);

    setWeights((prev) => {
      const newWeights = prev.map((w) => ({ ...w }));

      selectedAppObjects.forEach((app) => {
        app.requiredProperties.forEach((prop) => {
          const idx = newWeights.findIndex((w) => w.key === prop);
          if (idx >= 0) {
            newWeights[idx].active = true;
            newWeights[idx].value = Math.min(100, Math.max(newWeights[idx].value, 70));
          }
        });
      });

      if (challenge) {
        Object.entries(challenge.propertyBoosts).forEach(([key, boost]) => {
          const idx = newWeights.findIndex((w) => w.key === key);
          if (idx >= 0) {
            newWeights[idx].active = true;
            newWeights[idx].value = Math.min(100, newWeights[idx].value + (boost || 0));
          }
        });
      }

      return newWeights;
    });
  }, [selectedApps, selectedChallenge, availableChallenges]);

  const activeWeights = weights.filter((w) => w.active);
  const hasActiveFilters = activeWeights.length > 0 || selectedTech.length > 0 || selectedApps.length > 0 || selectedIndustries.length > 0;

  const scoredMaterials = useMemo(() => {
    let filtered = [...materials];

    if (selectedTech.length > 0) {
      filtered = filtered.filter((m) =>
        m.technologyAreas.some((t) => selectedTech.includes(t))
      );
    }

    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((m) =>
        m.industries.some((i) => selectedIndustries.includes(i))
      );
    }

    if (brandFilter) {
      filtered = filtered.filter((m) => m.brand === brandFilter);
    }

    const selectedAppObjects = applications.filter((a) => selectedApps.includes(a.id));
    const recommendedIds = new Set(
      selectedAppObjects.flatMap((a) => a.recommendedMaterials)
    );

    const scored = filtered.map((material) => {
      let totalScore = 0;
      let totalWeight = 0;

      if (activeWeights.length > 0) {
        activeWeights.forEach((w) => {
          const propValue = material.properties[w.key];
          const weight = w.value / 100;
          totalScore += propValue * weight;
          totalWeight += weight;
        });
      }

      const propertyScore = totalWeight > 0 ? totalScore / totalWeight : 50;
      const isRecommended = recommendedIds.has(material.id);
      const recommendationBonus = isRecommended ? 15 : 0;
      const score = Math.round(Math.min(100, propertyScore + recommendationBonus));

      return { material, score, isRecommended };
    });

    if (sortBy === "score") {
      scored.sort((a, b) => {
        if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
        return b.score - a.score;
      });
    } else if (sortBy === "name") {
      scored.sort((a, b) => a.material.name.localeCompare(b.material.name));
    } else {
      scored.sort((a, b) => a.material.brand.localeCompare(b.material.brand));
    }

    return scored;
  }, [weights, selectedTech, selectedApps, selectedIndustries, brandFilter, activeWeights, sortBy]);

  const updateWeight = (key: PropertyKey, value: number) => {
    setWeights((prev) =>
      prev.map((w) => (w.key === key ? { ...w, value, active: true } : w))
    );
  };

  const toggleProperty = (key: PropertyKey) => {
    setWeights((prev) =>
      prev.map((w) => (w.key === key ? { ...w, active: !w.active } : w))
    );
  };

  const resetAll = () => {
    setSelectedTech([]);
    setSelectedApps([]);
    setSelectedIndustries([]);
    setSelectedChallenge(null);
    setWeights(createDefaultWeights());
    setBrandFilter(null);
    setCurrentStep("technology");
  };

  const toggleTech = (id: string) =>
    setSelectedTech((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const toggleApp = (id: string) =>
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const toggleIndustry = (id: string) =>
    setSelectedIndustries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const goNext = () => {
    const idx = stepIndex;
    if (idx === 1) applyApplicationWeights();
    if (idx < steps.length - 1) setCurrentStep(steps[idx + 1].id);
  };

  const goBack = () => {
    const idx = stepIndex;
    if (idx > 0) setCurrentStep(steps[idx - 1].id);
  };

  const goToStep = (step: Step) => {
    const target = steps.findIndex((s) => s.id === step);
    if (target <= stepIndex + 1) {
      if (stepIndex === 1 && target > 1) applyApplicationWeights();
      setCurrentStep(step);
    }
  };

  const availableBrands = useMemo(() => {
    const brands = new Set(scoredMaterials.map((s) => s.material.brand));
    return Array.from(brands);
  }, [scoredMaterials]);

  // Group properties for display
  const smcPropertyKeys: PropertyKey[] = ["permeability", "coreLossLow", "coreLossHigh", "saturationInduction", "resistivity", "transverseRuptureStrength"];
  const brazingPropertyKeys: PropertyKey[] = ["jointStrength", "flowability", "wettability"];
  const mechanicalPropertyKeys: PropertyKey[] = ["tensileStrength", "hardness", "compressibility", "wearResistance", "machinability", "fatigue", "densityAchievable"];
  const generalPropertyKeys: PropertyKey[] = ["corrosionResistance", "thermalResistance", "costEfficiency", "sustainability"];

  const visibleWeights = weights.filter((w) => relevantPropertyKeys.includes(w.key));

  // Group visible weights by category
  const groupedWeights = useMemo(() => {
    const groups: { label: string; description: string; weights: typeof visibleWeights }[] = [];

    const smcWeights = visibleWeights.filter(w => smcPropertyKeys.includes(w.key));
    const brazingWeights = visibleWeights.filter(w => brazingPropertyKeys.includes(w.key));
    const mechWeights = visibleWeights.filter(w => mechanicalPropertyKeys.includes(w.key));
    const genWeights = visibleWeights.filter(w => generalPropertyKeys.includes(w.key));

    if (smcWeights.length > 0) {
      groups.push({
        label: "Magnetic Properties",
        description: "Core electromagnetic performance criteria for SMC materials",
        weights: smcWeights,
      });
    }
    if (brazingWeights.length > 0) {
      groups.push({
        label: "Brazing Properties",
        description: "Joint quality and filler metal characteristics",
        weights: brazingWeights,
      });
    }
    if (mechWeights.length > 0) {
      groups.push({
        label: "Mechanical Properties",
        description: "Strength, hardness and processability parameters",
        weights: mechWeights,
      });
    }
    if (genWeights.length > 0) {
      groups.push({
        label: "General Properties",
        description: "Environmental resistance, cost and sustainability",
        weights: genWeights,
      });
    }

    return groups;
  }, [visibleWeights]);

  return (
    <div>
      {/* Hero section - only on technology step */}
      {currentStep === "technology" && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroPowder} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(210,90%,10%)/0.92] via-[hsl(210,85%,15%)/0.85] to-[hsl(210,85%,25%)/0.7]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
                Material Selection Tool
              </p>
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
                Find the right powder for your application
              </h1>
              <p className="mb-8 max-w-lg text-base leading-relaxed text-primary-foreground/75">
                Navigate our complete portfolio of metal powders — from Astaloy&reg; and Distaloy&reg; to Somaloy&reg; SMC and BrazeLet&reg;. Tailored recommendations based on your technical requirements.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-foreground">{materials.length}+</p>
                  <p className="text-[11px] text-primary-foreground/60">Materials</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-foreground">{technologyAreas.length}</p>
                  <p className="text-[11px] text-primary-foreground/60">Technologies</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-foreground">{applications.length}</p>
                  <p className="text-[11px] text-primary-foreground/60">Applications</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Step indicator */}
        <div className="mb-10">
          <div className="mx-auto flex max-w-2xl items-center">
            {steps.map((step, i) => (
              <div key={step.id} className="flex flex-1 items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : i < stepIndex
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < stepIndex ? <Check className="h-4 w-4" /> : step.num}
                  </div>
                  <span className={`text-[11px] font-medium ${
                    currentStep === step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`mx-2 mb-5 h-px flex-1 ${i < stepIndex ? "bg-primary/30" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-center">
              <button onClick={resetAll} className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <RotateCcw className="h-3 w-3" /> Reset all selections
              </button>
            </div>
          )}
        </div>

        {/* ====== STEP: TECHNOLOGY ====== */}
        {currentStep === "technology" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="mb-1 text-xl font-bold tracking-tight text-foreground">
                Select Technology Area
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose which powder technology you are working with. Multiple selections are supported.
              </p>
            </div>

            {/* Technology cards with images */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {technologyAreas.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => toggleTech(tech.id)}
                  className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                    selectedTech.includes(tech.id)
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/30 hover:shadow-lg"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={techImages[tech.id]}
                      alt={tech.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(213,32%,12%)/0.85] via-[hsl(213,32%,12%)/0.3] to-transparent" />

                    {/* Selected indicator */}
                    {selectedTech.includes(tech.id) && (
                      <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-lg">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-bold text-white">{tech.name}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-card p-4">
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {tech.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tech.subAreas.slice(0, 3).map((sub) => (
                        <span key={sub} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                          {sub}
                        </span>
                      ))}
                      {tech.subAreas.length > 3 && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          +{tech.subAreas.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Industry filter with images */}
            <div className="mt-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Filter by industry (optional)
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => toggleIndustry(ind.id)}
                    className={`group overflow-hidden rounded-lg border transition-all ${
                      selectedIndustries.includes(ind.id)
                        ? "border-primary ring-1 ring-primary/30"
                        : "border-border hover:border-primary/20"
                    }`}
                  >
                    {/* Label above image */}
                    <div className={`px-2 py-1.5 text-center transition-colors ${
                      selectedIndustries.includes(ind.id) ? "bg-primary/10" : "bg-card"
                    }`}>
                      <p className="text-[10px] font-semibold leading-tight text-foreground">
                        {ind.name}
                      </p>
                    </div>
                    <div className="relative h-16 overflow-hidden">
                      <img
                        src={industryImages[ind.id]}
                        alt={ind.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {selectedIndustries.includes(ind.id) && (
                        <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={goNext}
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
              >
                {selectedTech.length > 0 ? `Continue with ${selectedTech.length} selected` : "Continue — all technologies"}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP: APPLICATION ====== */}
        {currentStep === "application" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="mb-1 text-xl font-bold tracking-tight text-foreground">
                Select Application
              </h2>
              <p className="text-sm text-muted-foreground">
                What will the material be used for? This determines which properties are most relevant.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => toggleApp(app.id)}
                  className={`group relative rounded-xl border p-5 text-left transition-all ${
                    selectedApps.includes(app.id)
                      ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/20 hover:shadow-sm"
                  }`}
                >
                  {selectedApps.includes(app.id) && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <h3 className="mb-1 text-sm font-bold text-foreground">{app.name}</h3>
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {app.requiredProperties.slice(0, 4).map((p) => (
                      <span key={p} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                        {propertyLabels[p].label}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Challenge scenarios */}
            {availableChallenges.length > 0 && (
              <div className="mt-8 rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Specific challenge (optional)
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {availableChallenges.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChallenge(selectedChallenge === ch.id ? null : ch.id)}
                      className={`rounded-lg border px-4 py-3 text-left transition-all ${
                        selectedChallenge === ch.id
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground">{ch.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{ch.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-center gap-3">
              <button onClick={goBack} className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={goNext} className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                {selectedApps.length > 0 ? "Continue with tailored properties" : "Skip this step"}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP: PROPERTIES ====== */}
        {currentStep === "properties" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="mb-1 text-xl font-bold tracking-tight text-foreground">
                Fine-tune Requirements
              </h2>
              <p className="text-sm text-muted-foreground">
                {relevantPropertyKeys.length < allPropertyKeys.length
                  ? `Showing ${relevantPropertyKeys.length} properties relevant to your selection. Activate and weight the most important ones.`
                  : "Activate and weight the properties most important for your application."}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              {/* Grouped property panels */}
              <div className="space-y-6">
                {groupedWeights.map((group) => (
                  <div key={group.label} className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* Group header */}
                    <div className="border-b border-border bg-muted/50 px-5 py-3">
                      <h3 className="text-sm font-bold text-foreground">{group.label}</h3>
                      <p className="text-[11px] text-muted-foreground">{group.description}</p>
                    </div>

                    {/* Property items */}
                    <div className="divide-y divide-border">
                      {group.weights.map((w) => (
                        <div
                          key={w.key}
                          className={`px-5 py-4 transition-all ${
                            w.active ? "bg-primary/5" : "hover:bg-muted/30"
                          }`}
                        >
                          <button
                            onClick={() => toggleProperty(w.key)}
                            className="flex w-full items-center justify-between"
                          >
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${w.active ? "text-foreground" : "text-muted-foreground"}`}>
                                  {propertyLabels[w.key].label}
                                </p>
                                {propertyLabels[w.key].unit && (
                                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                                    {propertyLabels[w.key].unit}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground">{propertyLabels[w.key].description}</p>
                            </div>
                            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-colors ${
                              w.active ? "bg-primary text-primary-foreground" : "border border-border bg-card"
                            }`}>
                              {w.active && <Check className="h-3 w-3" />}
                            </div>
                          </button>
                          {w.active && (
                            <div className="mt-3 space-y-1 pl-0">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground">Priority</span>
                                <span className="font-bold text-foreground">{w.value}%</span>
                              </div>
                              <Slider
                                value={[w.value]}
                                onValueChange={([v]) => updateWeight(w.key, v)}
                                min={10}
                                max={100}
                                step={5}
                              />
                              {/* Show real engineering value range */}
                              {propertyLabels[w.key].unit && propertyLabels[w.key].typicalRange && (
                                <p className="mt-1 text-[10px] text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    ≈ {interpolateValue(w.value, propertyLabels[w.key].typicalRange!)} {propertyLabels[w.key].unit}
                                  </span>
                                  <span className="ml-1.5 text-muted-foreground/70">
                                    (range: {propertyLabels[w.key].typicalRange![0]}–{propertyLabels[w.key].typicalRange![1]} {propertyLabels[w.key].unit})
                                  </span>
                                </p>
                              )}
                              {/* SMC context hints */}
                              {isSMCSelected && w.key === "coreLossLow" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Higher priority favors materials with lower W/kg at 50-400 Hz (e.g. Somaloy 700 5P ~32 W/kg at 1T/400Hz)
                                </p>
                              )}
                              {isSMCSelected && w.key === "coreLossHigh" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Higher priority favors materials optimized for 1-10 kHz (e.g. Somaloy 500 5P ~70 W/kg at 1T/1kHz)
                                </p>
                              )}
                              {isSMCSelected && w.key === "permeability" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Range: ~380 (Somaloy 500 3P) to ~900 (Somaloy 110i 5P). Higher permeability enables stronger magnetic flux.
                                </p>
                              )}
                              {isSMCSelected && w.key === "saturationInduction" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Range: ~1.4 T (Somaloy 500) to ~1.7 T (Somaloy 130i). Critical for motor torque density.
                                </p>
                              )}
                              {isSMCSelected && w.key === "resistivity" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Range: ~50 (1P) to ~800 (Somaloy 500 5P) micro-ohm-m. Higher resistivity reduces eddy current losses.
                                </p>
                              )}
                              {isSMCSelected && w.key === "transverseRuptureStrength" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Range: ~45 MPa (5P) to ~100 MPa (3P with steam treatment). Critical for component structural integrity.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {activeWeights.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Requirement Profile
                    </p>
                    <RadarChart
                      datasets={[{
                        label: "Your requirements",
                        data: relevantPropertyKeys.map((key) => {
                          const w = weights.find((wt) => wt.key === key);
                          return w?.active ? w.value : 0;
                        }),
                        color: "hsl(200, 75%, 40%)",
                      }]}
                      labels={relevantPropertyKeys.map((k) => propertyLabels[k].label)}
                      size={240}
                    />
                  </div>
                )}

                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Summary
                  </p>
                  <div className="space-y-2 text-xs">
                    {selectedTech.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground">Technology</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedTech.map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">
                              {technologyAreas.find((ta) => ta.id === t)?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedApps.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground">Applications</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedApps.map((a) => (
                            <Badge key={a} variant="secondary" className="text-[10px]">
                              {applications.find((ap) => ap.id === a)?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedChallenge && (
                      <div>
                        <p className="text-[10px] text-muted-foreground">Challenge</p>
                        <Badge variant="outline" className="text-[10px] border-accent text-accent">
                          {availableChallenges.find((c) => c.id === selectedChallenge)?.name}
                        </Badge>
                      </div>
                    )}
                    <div className="border-t border-border pt-2">
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{activeWeights.length}</span> properties active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick-activate all SMC properties */}
                {isSMCSelected && (
                  <button
                    onClick={() => {
                      setWeights(prev => prev.map(w =>
                        smcPropertyKeys.includes(w.key) ? { ...w, active: true, value: Math.max(w.value, 70) } : w
                      ));
                    }}
                    className="w-full rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-left transition-colors hover:bg-accent/10"
                  >
                    <p className="text-xs font-semibold text-accent">Activate all magnetic properties</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Enable permeability, core losses, Bsat, resistivity and TRS at once
                    </p>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <button onClick={goBack} className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={goNext} className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                Show {scoredMaterials.length} materials
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP: RESULTS ====== */}
        {currentStep === "results" && (
          <div className="animate-in fade-in duration-300">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              {/* Sidebar filters */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Active Filters
                    </p>
                    <button onClick={() => setCurrentStep("properties")} className="text-[10px] font-medium text-accent hover:underline">
                      Edit
                    </button>
                  </div>
                  {activeWeights.length > 0 ? (
                    <div className="space-y-2">
                      {activeWeights.map((w) => (
                        <div key={w.key} className="flex items-center gap-2">
                          <span className="flex-1 truncate text-xs text-foreground">
                            {propertyLabels[w.key].label}
                          </span>
                          <div className="w-14">
                            <div className="h-1.5 rounded-full bg-secondary">
                              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${w.value}%` }} />
                            </div>
                          </div>
                          <span className="w-7 text-right text-[10px] font-medium text-muted-foreground">{w.value}</span>
                          <button onClick={() => toggleProperty(w.key)} className="text-muted-foreground hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No property filters active</p>
                  )}
                </div>

                {/* Brand filter */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Brand
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setBrandFilter(null)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all ${
                        !brandFilter ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      All
                    </button>
                    {availableBrands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBrandFilter(brandFilter === b ? null : b)}
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all ${
                          brandFilter === b ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radar overlay */}
                {activeWeights.length > 0 && scoredMaterials.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Requirements vs. Best Match
                    </p>
                    <RadarChart
                      size={220}
                      datasets={[
                        {
                          label: "Your requirements",
                          data: relevantPropertyKeys.map((key) => {
                            const w = weights.find((wt) => wt.key === key);
                            return w?.active ? w.value : 0;
                          }),
                          color: "hsl(200, 75%, 40%)",
                        },
                        {
                          label: scoredMaterials[0].material.name,
                          data: relevantPropertyKeys.map((k) => scoredMaterials[0].material.properties[k]),
                          color: "hsl(210, 85%, 25%)",
                        },
                      ]}
                      labels={relevantPropertyKeys.map((k) => propertyLabels[k].label)}
                    />
                  </div>
                )}
              </div>

              {/* Results grid */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {scoredMaterials.length} materials
                    </h2>
                    {activeWeights.length > 0 && (
                      <p className="text-xs text-muted-foreground">Sorted by match score</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSortBy(sortBy === "score" ? "name" : sortBy === "name" ? "brand" : "score")}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <ArrowUpDown className="h-3 w-3" />
                    {sortBy === "score" ? "Match" : sortBy === "name" ? "Name" : "Brand"}
                  </button>
                </div>

                {/* Recommended highlight */}
                {selectedApps.length > 0 && scoredMaterials.some((s) => s.isRecommended) && (
                  <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
                    <p className="mb-2 text-xs font-semibold text-accent">
                      Recommended for your application
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scoredMaterials
                        .filter((s) => s.isRecommended)
                        .map((s) => (
                          <Badge key={s.material.id} className="bg-accent text-accent-foreground text-[10px]">
                            {s.material.name} — {s.score}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {scoredMaterials.map(({ material, score, isRecommended }) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      score={hasActiveFilters ? score : undefined}
                      onCompare={() => onCompare(material)}
                      isInCompare={compareList.some((c) => c.id === material.id)}
                      isRecommended={isRecommended}
                      relevantProperties={relevantPropertyKeys}
                    />
                  ))}
                </div>

                {scoredMaterials.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border py-20 text-center">
                    <p className="text-sm font-medium text-foreground">No materials match your criteria</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try broadening your selections or resetting filters</p>
                    <button onClick={resetAll} className="mt-4 rounded-lg bg-primary px-5 py-2 text-xs font-medium text-primary-foreground">
                      Reset all
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSelector;
