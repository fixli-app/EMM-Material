import { useState, useMemo, useCallback } from "react";
import {
  materials,
  propertyLabels,
  technologyAreas,
  applications,
  industries,
  type Material,
  type Application,
  type TechnologyArea,
} from "@/data/materials";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import MaterialCard from "./MaterialCard";
import RadarChart from "./RadarChart";
import {
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Zap,
  Layers,
  Target,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";

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

const SmartSelector = ({ onCompare, compareList }: SmartSelectorProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("technology");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [weights, setWeights] = useState<PropertyWeight[]>(createDefaultWeights());
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "name" | "brand">("score");

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "technology", label: "Teknologi", icon: <Layers className="h-4 w-4" /> },
    { id: "application", label: "Applikation", icon: <Target className="h-4 w-4" /> },
    { id: "properties", label: "Egenskaper", icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: "results", label: "Resultat", icon: <Zap className="h-4 w-4" /> },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  // Filter applications by selected tech areas
  const filteredApps = useMemo(() => {
    if (selectedTech.length === 0) return applications;
    return applications.filter((a) =>
      a.technologyAreas.some((t) => selectedTech.includes(t))
    );
  }, [selectedTech]);

  // Get relevant challenges
  const availableChallenges = useMemo(() => {
    if (selectedApps.length === 0) return [];
    return applications
      .filter((a) => selectedApps.includes(a.id))
      .flatMap((a) => a.challengeScenarios);
  }, [selectedApps]);

  // Auto-set property weights from application selection
  const applyApplicationWeights = useCallback(() => {
    const selectedAppObjects = applications.filter((a) => selectedApps.includes(a.id));
    const challenge = availableChallenges.find((c) => c.id === selectedChallenge);

    setWeights((prev) => {
      const newWeights = prev.map((w) => ({ ...w }));

      // Set properties based on application requirements
      selectedAppObjects.forEach((app) => {
        app.requiredProperties.forEach((prop) => {
          const idx = newWeights.findIndex((w) => w.key === prop);
          if (idx >= 0) {
            newWeights[idx].active = true;
            newWeights[idx].value = Math.min(100, Math.max(newWeights[idx].value, 70));
          }
        });
      });

      // Apply challenge boosts
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

  // Scoring
  const activeWeights = weights.filter((w) => w.active);
  const hasActiveFilters = activeWeights.length > 0 || selectedTech.length > 0 || selectedApps.length > 0 || selectedIndustries.length > 0;

  const scoredMaterials = useMemo(() => {
    let filtered = [...materials];

    // Filter by tech area
    if (selectedTech.length > 0) {
      filtered = filtered.filter((m) =>
        m.technologyAreas.some((t) => selectedTech.includes(t))
      );
    }

    // Filter by industry
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((m) =>
        m.industries.some((i) => selectedIndustries.includes(i))
      );
    }

    // Filter by brand
    if (brandFilter) {
      filtered = filtered.filter((m) => m.brand === brandFilter);
    }

    // Filter by recommended from selected apps
    const selectedAppObjects = applications.filter((a) => selectedApps.includes(a.id));
    const recommendedIds = new Set(
      selectedAppObjects.flatMap((a) => a.recommendedMaterials)
    );

    // Score
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

      // Bonus for recommended materials
      const isRecommended = recommendedIds.has(material.id);
      const recommendationBonus = isRecommended ? 15 : 0;

      const score = Math.round(Math.min(100, propertyScore + recommendationBonus));

      return { material, score, isRecommended };
    });

    // Sort
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
    if (idx === 1) applyApplicationWeights(); // Apply weights when leaving application step
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

  // Unique brands in current results
  const availableBrands = useMemo(() => {
    const brands = new Set(scoredMaterials.map((s) => s.material.brand));
    return Array.from(brands);
  }, [scoredMaterials]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(step.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground hoganas-shadow"
                    : i <= stepIndex
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.icon}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className="mx-1 h-3 w-3 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex items-center justify-center">
            <button onClick={resetAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> Rensa alla val
            </button>
          </div>
        )}
      </div>

      {/* ====== STEP: TECHNOLOGY ====== */}
      {currentStep === "technology" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Välj teknologiområde
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              Börja med att välja vilken pulverteknologi du arbetar med. Du kan välja flera.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {technologyAreas.map((tech) => (
              <button
                key={tech.id}
                onClick={() => toggleTech(tech.id)}
                className={`group rounded-xl border p-5 text-left transition-all ${
                  selectedTech.includes(tech.id)
                    ? "border-primary bg-primary/5 hoganas-shadow ring-1 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:hoganas-shadow"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{tech.icon}</span>
                  {selectedTech.includes(tech.id) && (
                    <Badge className="bg-primary text-primary-foreground text-[10px]">Vald</Badge>
                  )}
                </div>
                <h3 className="mb-1 text-sm font-bold text-foreground">{tech.name}</h3>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{tech.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tech.subAreas.slice(0, 4).map((sub) => (
                    <span key={sub} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                      {sub}
                    </span>
                  ))}
                  {tech.subAreas.length > 4 && (
                    <span className="text-[10px] text-muted-foreground">+{tech.subAreas.length - 4}</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Industry filter */}
          <div className="mx-auto mt-8 max-w-4xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Valfritt: Filtrera per bransch
            </p>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => toggleIndustry(ind.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedIndustries.includes(ind.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {ind.icon} {ind.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={goNext}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {selectedTech.length > 0 ? "Fortsätt" : "Hoppa över – Alla teknologier"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ====== STEP: APPLICATION ====== */}
      {currentStep === "application" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Välj applikation
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              Vad ska materialet användas till? Välj en eller flera applikationer för anpassade rekommendationer.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => toggleApp(app.id)}
                className={`group rounded-xl border p-5 text-left transition-all ${
                  selectedApps.includes(app.id)
                    ? "border-primary bg-primary/5 hoganas-shadow ring-1 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:hoganas-shadow"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{app.icon}</span>
                  {selectedApps.includes(app.id) && (
                    <Badge className="bg-primary text-primary-foreground text-[10px]">Vald</Badge>
                  )}
                </div>
                <h3 className="mb-1 text-sm font-bold text-foreground">{app.name}</h3>
                <p className="mb-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {app.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {app.requiredProperties.slice(0, 3).map((p) => (
                    <span key={p} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                      {propertyLabels[p].icon} {propertyLabels[p].label}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Challenge scenarios */}
          {availableChallenges.length > 0 && (
            <div className="mx-auto mt-8 max-w-4xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                🎯 Välj din utmaning (valfritt)
              </p>
              <div className="flex flex-wrap gap-2">
                {availableChallenges.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChallenge(selectedChallenge === ch.id ? null : ch.id)}
                    className={`rounded-xl border px-4 py-2.5 text-left transition-all ${
                      selectedChallenge === ch.id
                        ? "border-accent bg-accent/10 ring-1 ring-accent/20"
                        : "border-border bg-card hover:border-accent/30"
                    }`}
                  >
                    <p className="text-xs font-bold text-foreground">{ch.name}</p>
                    <p className="text-[11px] text-muted-foreground">{ch.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <button onClick={goBack} className="flex items-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground">
              <ChevronLeft className="h-4 w-4" /> Tillbaka
            </button>
            <button onClick={goNext} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              {selectedApps.length > 0 ? "Fortsätt med anpassade egenskaper" : "Hoppa över"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ====== STEP: PROPERTIES ====== */}
      {currentStep === "properties" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Finjustera egenskaper
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              {activeWeights.length > 0
                ? `${activeWeights.length} egenskaper aktiva baserat på dina val. Justera vikter eller lägg till fler.`
                : "Aktivera och vikta de egenskaper som är viktigast för din tillämpning."}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
            {/* Property grid */}
            <div className="grid gap-2 sm:grid-cols-2">
              {weights.map((w) => (
                <div
                  key={w.key}
                  className={`rounded-xl border p-4 transition-all ${
                    w.active
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card hover:border-primary/20"
                  }`}
                >
                  <button
                    onClick={() => toggleProperty(w.key)}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{propertyLabels[w.key].icon}</span>
                      <div className="text-left">
                        <p className={`text-sm font-medium ${w.active ? "text-foreground" : "text-muted-foreground"}`}>
                          {propertyLabels[w.key].label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{propertyLabels[w.key].description}</p>
                      </div>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      w.active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {w.active ? "✓" : ""}
                    </div>
                  </button>
                  {w.active && (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Prioritet</span>
                        <span className="font-semibold text-foreground">{w.value}%</span>
                      </div>
                      <Slider
                        value={[w.value]}
                        onValueChange={([v]) => updateWeight(w.key, v)}
                        min={10}
                        max={100}
                        step={5}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Radar preview */}
            <div className="space-y-4">
              {activeWeights.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Din kravprofil
                  </p>
                  <RadarChart
                    datasets={[{
                      label: "Dina krav",
                      data: allPropertyKeys.map((key) => {
                        const w = weights.find((wt) => wt.key === key);
                        return w?.active ? w.value : 0;
                      }),
                      color: "hsl(200, 75%, 40%)",
                    }]}
                    labels={allPropertyKeys.map((k) => propertyLabels[k].label)}
                    size={260}
                  />
                </div>
              )}

              {/* Active selections summary */}
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dina val
                </p>
                <div className="space-y-2">
                  {selectedTech.length > 0 && (
                    <div>
                      <p className="text-[10px] text-muted-foreground">Teknologi</p>
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
                      <p className="text-[10px] text-muted-foreground">Applikationer</p>
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
                      <p className="text-[10px] text-muted-foreground">Utmaning</p>
                      <Badge variant="outline" className="text-[10px] border-accent text-accent">
                        {availableChallenges.find((c) => c.id === selectedChallenge)?.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button onClick={goBack} className="flex items-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground">
              <ChevronLeft className="h-4 w-4" /> Tillbaka
            </button>
            <button onClick={goNext} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              <Sparkles className="h-4 w-4" />
              Visa {scoredMaterials.length} material
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ====== STEP: RESULTS ====== */}
      {currentStep === "results" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Sidebar filters */}
            <div className="space-y-4">
              {/* Quick edit active props */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Filter className="mr-1 inline h-3 w-3" /> Aktiva filter
                  </p>
                  <button onClick={() => setCurrentStep("properties")} className="text-[10px] text-accent hover:underline">
                    Redigera
                  </button>
                </div>
                {activeWeights.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeWeights.map((w) => (
                      <div key={w.key} className="flex items-center gap-2">
                        <span className="text-sm">{propertyLabels[w.key].icon}</span>
                        <span className="flex-1 truncate text-xs text-foreground">
                          {propertyLabels[w.key].label}
                        </span>
                        <div className="w-16">
                          <div className="h-1.5 rounded-full bg-secondary">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${w.value}%` }} />
                          </div>
                        </div>
                        <span className="w-8 text-right text-[10px] font-medium text-muted-foreground">{w.value}%</span>
                        <button onClick={() => toggleProperty(w.key)} className="text-muted-foreground hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Inga egenskapsfilter aktiva</p>
                )}
              </div>

              {/* Brand filter */}
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Varumärke
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setBrandFilter(null)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      !brandFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Alla
                  </button>
                  {availableBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrandFilter(brandFilter === b ? null : b)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        brandFilter === b ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
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
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Krav vs. Bästa match
                  </p>
                  <RadarChart
                    size={240}
                    datasets={[
                      {
                        label: "Dina krav",
                        data: allPropertyKeys.map((key) => {
                          const w = weights.find((wt) => wt.key === key);
                          return w?.active ? w.value : 0;
                        }),
                        color: "hsl(200, 75%, 40%)",
                      },
                      {
                        label: scoredMaterials[0].material.name,
                        data: allPropertyKeys.map((k) => scoredMaterials[0].material.properties[k]),
                        color: "hsl(210, 85%, 25%)",
                      },
                    ]}
                    labels={allPropertyKeys.map((k) => propertyLabels[k].label)}
                  />
                </div>
              )}
            </div>

            {/* Results grid */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{scoredMaterials.length}</span> material
                  {activeWeights.length > 0 && " – sorterat efter matchning"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortBy(sortBy === "score" ? "name" : sortBy === "name" ? "brand" : "score")}
                    className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                  >
                    <ArrowUpDown className="h-3 w-3" />
                    {sortBy === "score" ? "Matchning" : sortBy === "name" ? "Namn" : "Varumärke"}
                  </button>
                </div>
              </div>

              {/* Recommended highlight */}
              {selectedApps.length > 0 && scoredMaterials.some((s) => s.isRecommended) && (
                <div className="mb-4 rounded-xl bg-accent/10 border border-accent/20 p-4">
                  <p className="mb-2 text-xs font-semibold text-accent">
                    ⭐ Rekommenderade för din applikation
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scoredMaterials
                      .filter((s) => s.isRecommended)
                      .map((s) => (
                        <Badge key={s.material.id} className="bg-accent text-accent-foreground text-[10px]">
                          {s.material.name} ({s.score})
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {scoredMaterials.map(({ material, score, isRecommended }) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    score={hasActiveFilters ? score : undefined}
                    onCompare={() => onCompare(material)}
                    isInCompare={compareList.some((c) => c.id === material.id)}
                    isRecommended={isRecommended}
                  />
                ))}
              </div>

              {scoredMaterials.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-xl">🔍</p>
                  <p className="mt-2 text-sm font-medium text-foreground">Inga material matchar dina filter</p>
                  <p className="text-xs text-muted-foreground">Prova att bredda dina val</p>
                  <button onClick={resetAll} className="mt-4 rounded-lg bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground">
                    Rensa filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSelector;
