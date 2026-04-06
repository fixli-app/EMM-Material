import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  materials,
  propertyLabels,
  technologyAreas,
  applications,
  industries,
  type Material,
} from "@/data/materials";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import MaterialCard from "./MaterialCard";
import PdfModal from "./PdfModal";
import RadarChart from "./RadarChart";
import {
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Sparkles,
  Info,
} from "lucide-react";
import techSoftMag from "@/assets/tech-soft-magnetics.jpg";
import FloatingOrbs from "./FloatingOrbs";
import { useParallax } from "@/hooks/use-parallax";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

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

type Step = "application" | "properties" | "results";

// Interpolate a percentage (10-100) to a real engineering value range
const interpolateValue = (pct: number, range: [number, number]): string => {
  const [min, max] = range;
  const val = min + (pct / 100) * (max - min);
  if (max < 5) return val.toFixed(2);
  if (max < 100) return val.toFixed(1);
  return Math.round(val).toString();
};

const SmartSelector = ({ onCompare, compareList }: SmartSelectorProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("application");
  const { ref: heroRef, offset: heroOffset } = useParallax(0.3);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [weights, setWeights] = useState<PropertyWeight[]>(createDefaultWeights());
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  // Auto-reset when navigating away and back
  useEffect(() => {
    setSelectedApps([]);
    setSelectedIndustries([]);
    setSelectedChallenge(null);
    setWeights(createDefaultWeights());
    setCurrentStep("application");
  }, [location.pathname]);

  const steps: { id: Step; label: string; num: number }[] = [
    { id: "application", label: "Application", num: 1 },
    { id: "properties", label: "Requirements", num: 2 },
    { id: "results", label: "Results", num: 3 },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  // Always SMC context
  const smcTech = technologyAreas[0]; // soft-magnetics

  // Determine relevant properties
  const relevantPropertyKeys = useMemo((): PropertyKey[] => {
    const propSet = new Set<PropertyKey>();
    smcTech.relevantProperties.forEach((p) => propSet.add(p));

    if (selectedApps.length > 0) {
      selectedApps.forEach((appId) => {
        const app = applications.find((a) => a.id === appId);
        app?.requiredProperties.forEach((p) => propSet.add(p));
      });
    }

    return allPropertyKeys.filter((k) => propSet.has(k));
  }, [selectedApps]);

  const filteredApps = applications;

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
  const hasActiveFilters = activeWeights.length > 0 || selectedApps.length > 0 || selectedIndustries.length > 0;

  const scoredMaterials = useMemo(() => {
    let filtered = [...materials];

    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((m) =>
        m.industries.some((i) => selectedIndustries.includes(i))
      );
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
    } else {
      scored.sort((a, b) => a.material.name.localeCompare(b.material.name));
    }

    // Mark the most eco-friendly material
    if (scored.length > 0) {
      const maxSustainability = Math.max(...scored.map(s => s.material.properties.sustainability));
      scored.forEach(s => {
        (s as any).isMostEcoFriendly = s.material.properties.sustainability === maxSustainability && maxSustainability >= 65;
      });
    }

    return scored;
  }, [weights, selectedApps, selectedIndustries, activeWeights, sortBy]);

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
    setSelectedApps([]);
    setSelectedIndustries([]);
    setSelectedChallenge(null);
    setWeights(createDefaultWeights());
    setCurrentStep("application");
    scrollToTop();
  };

  const toggleApp = (id: string) =>
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const toggleIndustry = (id: string) =>
    setSelectedIndustries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  };

  const goNext = () => {
    const idx = stepIndex;
    if (idx === 0) applyApplicationWeights();
    if (idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1].id);
      scrollToTop();
    }
  };

  const goBack = () => {
    const idx = stepIndex;
    if (idx > 0) {
      setCurrentStep(steps[idx - 1].id);
      scrollToTop();
    }
  };

  const goToStep = (step: Step) => {
    const target = steps.findIndex((s) => s.id === step);
    if (target <= stepIndex + 1) {
      if (stepIndex === 0 && target > 0) applyApplicationWeights();
      setCurrentStep(step);
      scrollToTop();
    }
  };

  // Group properties for display
  const smcPropertyKeys: PropertyKey[] = ["permeability", "coreLossLow", "coreLossHigh", "saturationInduction", "resistivity", "transverseRuptureStrength"];
  const mechanicalPropertyKeys: PropertyKey[] = ["compressibility", "densityAchievable"];
  const generalPropertyKeys: PropertyKey[] = ["thermalResistance", "costEfficiency", "sustainability"];

  const visibleWeights = weights.filter((w) => relevantPropertyKeys.includes(w.key));

  // Group visible weights by category
  const groupedWeights = useMemo(() => {
    const groups: { label: string; description: string; weights: typeof visibleWeights }[] = [];

    const smcWeights = visibleWeights.filter(w => smcPropertyKeys.includes(w.key));
    const mechWeights = visibleWeights.filter(w => mechanicalPropertyKeys.includes(w.key));
    const genWeights = visibleWeights.filter(w => generalPropertyKeys.includes(w.key));

    if (smcWeights.length > 0) {
      groups.push({
        label: "Magnetic Properties",
        description: "Core electromagnetic performance criteria for SMC materials",
        weights: smcWeights,
      });
    }
    if (mechWeights.length > 0) {
      groups.push({
        label: "Processing Properties",
        description: "Compaction and density parameters",
        weights: mechWeights,
      });
    }
    if (genWeights.length > 0) {
      groups.push({
        label: "General Properties",
        description: "Thermal resistance, cost and sustainability",
        weights: genWeights,
      });
    }

    return groups;
  }, [visibleWeights]);

  return (
    <div>
      {/* Hero section - only on first step */}
      {currentStep === "application" && (
        <motion.section
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0" style={{ transform: `translateY(${heroOffset}px) scale(1.15)` }}>
            <img src={techSoftMag} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,85%,8%)/0.95] via-[hsl(215,80%,14%)/0.88] to-[hsl(195,85%,25%)/0.6]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(215,85%,8%)/0.3] to-transparent" />
          </div>
          <FloatingOrbs />
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[hsl(195,85%,38%)/0.06] blur-[100px]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 min-h-[60vh] flex items-center sm:py-28 sm:min-h-0">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-1.5 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-hoganas-glow animate-pulse-glow" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                  Somaloy® SMC Selector
                </span>
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Find the right
                <br />
                <span className="bg-gradient-to-r from-primary-foreground via-primary-foreground/90 to-[hsl(195,85%,65%)] bg-clip-text text-transparent">
                  Somaloy® grade
                </span>
              </h1>
              <p className="mb-10 max-w-lg text-[15px] leading-relaxed text-primary-foreground/65 sm:text-base">
                Select your application and fine-tune requirements to find the optimal Soft Magnetic Composite for your electromagnetic design.
              </p>
              <div className="flex items-center gap-8">
                {[
                  { value: String(materials.length), label: "SMC grades" },
                  { value: String(applications.length), label: "Applications" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                    <p className="text-[11px] text-primary-foreground/45 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Step indicator */}
        <div className="mb-12">
          <div className="mx-auto flex max-w-xl items-center">
            {steps.map((step, i) => (
              <div key={step.id} className="flex flex-1 items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                      currentStep === step.id
                        ? "hoganas-gradient-warm text-primary-foreground shadow-lg shadow-primary/20"
                        : i < stepIndex
                        ? "bg-accent/15 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < stepIndex ? <Check className="h-4 w-4" /> : step.num}
                  </div>
                  <span className={`text-[11px] font-semibold ${
                    currentStep === step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`mx-3 mb-5 h-0.5 flex-1 rounded-full transition-colors ${i < stepIndex ? "bg-accent/30" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {hasActiveFilters && (
            <div className="mt-5 flex items-center justify-center">
              <button onClick={resetAll} className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:shadow-sm">
                <RotateCcw className="h-3 w-3" /> Reset all selections
              </button>
            </div>
          )}
        </div>

        {/* ====== STEP: APPLICATION ====== */}
        {currentStep === "application" && (
          <div className="animate-in fade-in duration-300">
          <AnimatedSection delay={0.05}>
            <div className="mb-8">
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
                Select Application
              </h2>
              <p className="text-[14px] text-muted-foreground">
                What will the SMC material be used for? This determines which magnetic properties are most relevant.
              </p>
            </div>
          </AnimatedSection>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => (
                <StaggerItem key={app.id}>
                <button
                  onClick={() => toggleApp(app.id)}
                  className={`group relative w-full rounded-2xl border p-6 text-left transition-all duration-300 ${
                    selectedApps.includes(app.id)
                      ? "border-accent/40 bg-accent/5 ring-1 ring-accent/20 shadow-md shadow-accent/5"
                      : "border-border bg-card hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                  }`}
                >
                  {selectedApps.includes(app.id) && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg bg-accent">
                      <Check className="h-3.5 w-3.5 text-accent-foreground" />
                    </div>
                  )}
                  <h3 className="mb-1.5 text-[14px] font-bold text-foreground">{app.name}</h3>
                  <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.requiredProperties.slice(0, 4).map((p) => (
                      <span key={p} className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {propertyLabels[p].label}
                      </span>
                    ))}
                  </div>
                </button>
                </StaggerItem>
              ))}
            </StaggerContainer>

          <AnimatedSection delay={0.15}>
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Filter by industry (optional)
              </p>
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => toggleIndustry(ind.id)}
                    className={`rounded-lg border px-4 py-2.5 text-xs font-medium transition-all ${
                      selectedIndustries.includes(ind.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

            {/* Challenge scenarios */}
            {availableChallenges.length > 0 && (
              <AnimatedSection delay={0.2}>
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
              </AnimatedSection>
            )}

            <div className="mt-12 flex justify-center">
              <button onClick={goNext} className="group flex items-center gap-2.5 rounded-xl hoganas-gradient-warm px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20">
                {selectedApps.length > 0 ? "Continue with tailored properties" : "Continue — all SMC grades"}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP: PROPERTIES ====== */}
        {currentStep === "properties" && (
          <div className="animate-in fade-in duration-300">
          <AnimatedSection delay={0.05}>
            <div className="mb-8">
              <h2 className="mb-1 text-xl font-bold tracking-tight text-foreground">
                Fine-tune Requirements
              </h2>
              <p className="text-sm text-muted-foreground">
                Activate and weight the magnetic and mechanical properties most important for your SMC application.
              </p>
            </div>
          </AnimatedSection>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              {/* Grouped property panels */}
              <StaggerContainer className="space-y-6">
                {groupedWeights.map((group) => (
                  <StaggerItem key={group.label}>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="border-b border-border bg-muted/50 px-5 py-3">
                      <h3 className="text-sm font-bold text-foreground">{group.label}</h3>
                      <p className="text-[11px] text-muted-foreground">{group.description}</p>
                    </div>

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
                              {w.key === "coreLossLow" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Higher priority favors materials with lower W/kg at 50-400 Hz (e.g. Somaloy 700 5P ~32 W/kg at 1T/400Hz)
                                </p>
                              )}
                              {w.key === "coreLossHigh" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Higher priority favors materials optimized for 1-10 kHz (e.g. Somaloy 500 5P ~70 W/kg at 1T/1kHz)
                                </p>
                              )}
                              {w.key === "permeability" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Range: ~380 (Somaloy 500 3P) to ~900 (Somaloy 110i 5P). Higher permeability enables stronger magnetic flux.
                                </p>
                              )}
                              {w.key === "saturationInduction" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Range: ~1.4 T (Somaloy 500) to ~1.7 T (Somaloy 130i). Critical for motor torque density.
                                </p>
                              )}
                              {w.key === "resistivity" && (
                                <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                  Range: ~50 (1P) to ~800 (Somaloy 500 5P) micro-ohm-m. Higher resistivity reduces eddy current losses.
                                </p>
                              )}
                              {w.key === "transverseRuptureStrength" && (
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
                  </StaggerItem>
                ))}
              </StaggerContainer>

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
                      {scoredMaterials.length} Somaloy® grades
                    </h2>
                    {activeWeights.length > 0 && (
                      <p className="text-xs text-muted-foreground">Sorted by match score</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSortBy(sortBy === "score" ? "name" : "score")}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {sortBy === "score" ? "Match" : "Name"}
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

                <StaggerContainer className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {scoredMaterials.map(({ material, score, isRecommended, ...rest }) => (
                    <StaggerItem key={material.id}>
                    <MaterialCard
                      material={material}
                      score={hasActiveFilters ? score : undefined}
                      onCompare={() => onCompare(material)}
                      isInCompare={compareList.some((c) => c.id === material.id)}
                      isRecommended={isRecommended}
                      isMostEcoFriendly={(rest as any).isMostEcoFriendly === true}
                      relevantProperties={relevantPropertyKeys}
                      onOpenDataSheet={(url, title) => setDataSheetModal({ url, title })}
                    />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

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

      {/* Floating compare bar */}
      <AnimatePresence>
        {compareList.length >= 1 && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
          >
            <div className="border-t border-border/60 bg-card/95 px-4 py-3 shadow-[0_-4px_24px_-6px_hsl(var(--primary)/0.1)] backdrop-blur-2xl sm:rounded-2xl sm:border sm:border-border/40 sm:px-5 sm:shadow-[0_8px_40px_-10px_hsl(var(--primary)/0.2)]">
              <div className="flex items-center justify-between gap-3">
                {/* Material chips with remove */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <AnimatePresence mode="popLayout">
                    {compareList.map((m) => (
                      <motion.div
                        key={m.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="group flex shrink-0 items-center gap-1 rounded-full bg-primary/10 py-1 pl-2.5 pr-1 text-[11px] font-medium text-foreground sm:text-xs"
                      >
                        <span className="max-w-[80px] truncate sm:max-w-[120px]">
                          {m.name.replace("Somaloy® ", "")}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onCompare(m); }}
                          className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive sm:h-5 sm:w-5"
                        >
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Compare button or hint */}
                {compareList.length >= 2 ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/compare")}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 sm:px-5 sm:text-sm"
                  >
                    Compare
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </motion.button>
                ) : (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="shrink-0 text-[11px] italic text-muted-foreground sm:text-xs"
                  >
                    Add one more to compare
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSelector;
