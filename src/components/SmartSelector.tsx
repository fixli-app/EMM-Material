import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  materials,
  getScoreProperty,
  propertyLabels,
  scorePropertyKeys,
  technologyAreas,
  motorDesignerApplications,
  somaloyMaterialFamilies,
  type Material,
  type MotorDesignerApplication,
  type ScorePropertyKey,
} from "@/data/materials";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MaterialCard from "./MaterialCard";
import ContactCallout from "./ContactCallout";
import PdfModal from "./PdfModal";
import RadarChart from "./RadarChart";
import { RotateCcw, ChevronRight, ArrowLeft, X, Check, Info } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";
import { brandColors, chartSeriesColors } from "@/lib/brandColors";

type PropertyKey = ScorePropertyKey;

interface PropertyWeight {
  key: PropertyKey;
  value: number;
  active: boolean;
}

const allPropertyKeys = scorePropertyKeys;
const smcPropertyKeys: PropertyKey[] = [
  "permeability",
  "coreLossLow",
  "coreLossHigh",
  "saturationInduction",
];
const generalPropertyKeys: PropertyKey[] = ["resistivity", "transverseRuptureStrength"];

const createDefaultWeights = (): PropertyWeight[] => allPropertyKeys.map((key) => ({ key, value: 50, active: false }));

interface SmartSelectorProps {
  onCompare: (material: Material) => void;
  compareList: Material[];
}

type Step = "application" | "properties" | "results";

// Persist the wizard state so navigating to Compare and back (or using the
// browser Back button) never forces the user to start over.
const STORAGE_KEY = "hoganas-selector-state";

interface PersistedSelectorState {
  applicationId: string | null;
  weights: PropertyWeight[];
  step: Step;
  hasUserFineTuned?: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPropertyKey = (value: unknown): value is PropertyKey =>
  typeof value === "string" && allPropertyKeys.includes(value as PropertyKey);

const loadPersistedState = (): PersistedSelectorState | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;

    const savedWeights = new Map<PropertyKey, PropertyWeight>();
    if (Array.isArray(parsed.weights)) {
      parsed.weights.forEach((weight) => {
        if (
          !isRecord(weight)
          || !isPropertyKey(weight.key)
          || typeof weight.value !== "number"
          || !Number.isFinite(weight.value)
          || typeof weight.active !== "boolean"
        ) return;

        const value = Math.round(Math.min(100, Math.max(10, weight.value)) / 5) * 5;
        savedWeights.set(weight.key, { key: weight.key, value, active: weight.active });
      });
    }

    const applicationId = typeof parsed.applicationId === "string"
      && motorDesignerApplications.some((application) => application.id === parsed.applicationId)
      ? parsed.applicationId
      : null;
    const step: Step = parsed.step === "properties" || parsed.step === "results" ? parsed.step : "application";

    return {
      applicationId,
      weights: allPropertyKeys.map((key) => savedWeights.get(key) ?? { key, value: 50, active: false }),
      step,
      hasUserFineTuned: parsed.hasUserFineTuned === true,
    };
  } catch {
    return null;
  }
};

const SmartSelector = ({ onCompare, compareList }: SmartSelectorProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const persisted = useMemo(loadPersistedState, []);
  const [currentStep, setCurrentStepState] = useState<Step>(() => {
    const savedStep = persisted?.step;
    return savedStep === "properties" || savedStep === "results" ? savedStep : "application";
  });
  const [weights, setWeights] = useState<PropertyWeight[]>(persisted?.weights ?? createDefaultWeights());
  const [hasUserFineTuned, setHasUserFineTuned] = useState(persisted?.hasUserFineTuned ?? false);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [dataSheetModal, setDataSheetModal] = useState<{ url: string; title: string } | null>(null);
  const [selectedDensityByFamily, setSelectedDensityByFamily] = useState<Record<string, string>>({});
  const [densityChartFamilyId, setDensityChartFamilyId] = useState(() => somaloyMaterialFamilies[0]?.id ?? "");

  const [selectedApplication, setSelectedApplication] = useState<MotorDesignerApplication | null>(
    () => motorDesignerApplications.find((a) => a.id === persisted?.applicationId) ?? null,
  );

  // Keep the wizard state across page navigations (e.g. Compare and back).
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          applicationId: selectedApplication?.id ?? null,
          weights,
          step: currentStep,
          hasUserFineTuned,
        } satisfies PersistedSelectorState),
      );
    } catch {
      /* ignore */
    }
  }, [selectedApplication, weights, currentStep, hasUserFineTuned]);

  // Sync the wizard step with the URL so the browser Back/Forward buttons
  // move between steps instead of leaving the page and losing state.
  const firstLoad = useRef(true);
  useEffect(() => {
    const requestedStep = searchParams.get("step");
    if (!requestedStep || requestedStep === "path") {
      if (firstLoad.current) {
        // First load on a bare URL, reflect any restored step in the URL
        // (no new history entry) so Back/Forward stay consistent.
        firstLoad.current = false;
      }
      setCurrentStepState("application");
      setSearchParams({ step: "application" }, { replace: true });
      if (requestedStep === "path" || !firstLoad.current) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      }
      return;
    }
    firstLoad.current = false;
    const urlStep = requestedStep as Step;
    const valid: Step[] = ["application", "properties", "results"];
    if (!valid.includes(urlStep) || urlStep === currentStep) return;
    setCurrentStepState(urlStep);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // All step transitions go through here so each step gets its own history
  // entry, the browser Back button then returns to the previous step.
  const navigateStep = (step: Step) => {
    setCurrentStepState(step);
    setSearchParams({ step });
  };

  // Persist the selected application so Expert Insights (Compare page) can
  // show the recommendation for the chosen application.
  useEffect(() => {
    try {
      if (selectedApplication) {
        localStorage.setItem("hoganas-selected-application", selectedApplication.id);
      } else {
        localStorage.removeItem("hoganas-selected-application");
      }
    } catch {
      /* ignore */
    }
  }, [selectedApplication]);

  const steps: { id: Step; label: string; num: number }[] = [
    { id: "application", label: "Application", num: 1 },
    { id: "properties", label: "Requirements", num: 2 },
    { id: "results", label: "Results", num: 3 },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  // Always SMC context
  const smcTech = technologyAreas[0]; // soft-magnetics

  // Properties available for filtering, SMC-relevant set, no application coupling
  const relevantPropertyKeys = useMemo((): PropertyKey[] => {
    const propSet = new Set<PropertyKey>(smcTech.relevantProperties);
    return allPropertyKeys.filter((k) => propSet.has(k));
  }, [smcTech.relevantProperties]);

  const activeWeights = weights.filter((w) => w.active && relevantPropertyKeys.includes(w.key));
  const hasActiveFilters = activeWeights.length > 0;
  const hasScoringFilters = (!selectedApplication || hasUserFineTuned) && hasActiveFilters;
  const showAllCatalog = !hasScoringFilters && (!selectedApplication || hasUserFineTuned);
  const scoringWeights = hasScoringFilters ? activeWeights : [];

  const scoredMaterials = useMemo(() => {
    const showAllAfterClearingRequirements = hasUserFineTuned && !hasActiveFilters;
    const usesApplicationRecommendations = Boolean(selectedApplication) && !showAllAfterClearingRequirements;

    // Keep application recommendations until the user clears every fine-tuned requirement.
    const pool = usesApplicationRecommendations && selectedApplication
      ? selectedApplication.recommendedMaterialIds
          .map((id) => materials.find((m) => m.id === id))
          .filter((m): m is Material => Boolean(m))
      : materials;

    const eligiblePool = scoringWeights.length > 0
      ? pool.filter((material) => scoringWeights.every((weight) => getScoreProperty(material, weight.key) !== undefined))
      : pool;

    const allScored = eligiblePool.map((material) => {
      let totalScore = 0;
      let totalWeight = 0;

      if (scoringWeights.length > 0) {
        scoringWeights.forEach((w) => {
          const propValue = getScoreProperty(material, w.key) ?? 0;
          const weight = w.value / 100;
          totalScore += propValue * weight;
          totalWeight += weight;
        });
      }

      const propertyScore = totalWeight > 0 ? totalScore / totalWeight : 50;
      const score = Math.round(Math.min(100, propertyScore));

      return { material, score };
    });

    // When an application is selected, show exactly the curated grades, one
    // representative per recommendation rank (e.g. the best-scoring 7P density
    // variant represents the "Somaloy 700 7P" recommendation).
    let scored = allScored;
    if (usesApplicationRecommendations && selectedApplication) {
      const keepIds = new Set<string>();
      selectedApplication.recommendedGroups.forEach((group) => {
        const members = allScored.filter((s) => group.includes(s.material.id));
        if (members.length > 0) {
          const best = hasScoringFilters
            ? members.reduce((a, b) => (b.score > a.score ? b : a))
            : members[0];
          keepIds.add(best.material.id);
        }
      });
      scored = allScored.filter((s) => keepIds.has(s.material.id));
    }

    if (sortBy === "score" && hasScoringFilters) {
      scored.sort((a, b) => b.score - a.score);
    } else if (sortBy === "name") {
      scored.sort((a, b) => a.material.name.localeCompare(b.material.name));
    }

    return scored;
  }, [scoringWeights, hasScoringFilters, sortBy, selectedApplication, hasUserFineTuned, hasActiveFilters]);

  const visibleMaterials = useMemo(() => {
    if (!hasScoringFilters) return scoredMaterials;

    const topMatches = [...scoredMaterials]
      .sort((a, b) => b.score - a.score || a.material.name.localeCompare(b.material.name))
      .slice(0, 5);

    return topMatches;
  }, [scoredMaterials, hasScoringFilters]);
  const resultPropertyKeys = visibleMaterials[0]
    ? relevantPropertyKeys.filter((key) => getScoreProperty(visibleMaterials[0].material, key) !== undefined)
    : [];
  const radarPropertyKeys = hasScoringFilters && visibleMaterials.length > 0 ? resultPropertyKeys : relevantPropertyKeys;
  const comparisonProfileKeys = compareList.length > 0
    ? scorePropertyKeys.filter((key) => compareList.every((material) => getScoreProperty(material, key) !== undefined))
    : relevantPropertyKeys;

  const updateWeight = (key: PropertyKey, value: number) => {
    setHasUserFineTuned(true);
    setWeights((prev) => prev.map((w) => (w.key === key ? { ...w, value, active: true } : w)));
  };

  const toggleProperty = (key: PropertyKey) => {
    const isRemovingLastActiveFilter = weights.some((weight) => weight.key === key && weight.active)
      && activeWeights.length === 1;

    setHasUserFineTuned(true);
    setWeights((prev) => prev.map((w) => (w.key === key ? { ...w, active: !w.active } : w)));
    if (isRemovingLastActiveFilter) setSortBy("name");
  };

  // Prefill the Fine-tune Requirements with the application's priority profile.
  // The first priority gets the highest weight, then it steps down. Users can
  // still uncheck or adjust any property afterwards.
  const weightsForApplication = (app: MotorDesignerApplication): PropertyWeight[] => {
    const steps = [100, 85, 70, 55];
    return allPropertyKeys.map((key) => {
      const idx = app.priorityProperties.indexOf(key);
      if (idx === -1) return { key, value: 50, active: false };
      return { key, value: steps[Math.min(idx, steps.length - 1)], active: true };
    });
  };

  const resetAll = () => {
    setHasUserFineTuned(false);
    setWeights(selectedApplication ? weightsForApplication(selectedApplication) : createDefaultWeights());
    navigateStep("application");
    scrollToTop();
  };

  const selectApplication = (app: MotorDesignerApplication) => {
    setHasUserFineTuned(false);
    setSelectedApplication(app);
    setWeights(weightsForApplication(app));
    navigateStep("properties");
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  };

  const goNext = () => {
    const idx = stepIndex;
    if (idx < steps.length - 1) {
      navigateStep(steps[idx + 1].id);
      scrollToTop();
    }
  };

  const goBack = () => {
    const idx = stepIndex;
    if (idx > 0) {
      navigateStep(steps[idx - 1].id);
      scrollToTop();
    }
  };

  const goToStep = (step: Step) => {
    const target = steps.findIndex((s) => s.id === step);
    if (target <= stepIndex + 1) {
      navigateStep(step);
      scrollToTop();
    }
  };

  // Group properties for display
  const visibleWeights = weights.filter((w) => relevantPropertyKeys.includes(w.key));
  const ironMaterials = materials.filter((material) => material.brand === "Iron");
  const densityChartFamily = somaloyMaterialFamilies.find((family) => family.id === densityChartFamilyId)
    ?? somaloyMaterialFamilies[0];
  const densityChartPropertyKeys = densityChartFamily?.variants.length
    ? scorePropertyKeys.filter((key) => densityChartFamily.variants.every((variant) => getScoreProperty(variant, key) !== undefined))
    : [];

  const selectDensityVariant = (familyId: string, materialId: string) => {
    setSelectedDensityByFamily((previous) => ({ ...previous, [familyId]: materialId }));
    setDensityChartFamilyId(familyId);
  };

  // Group visible weights by category
  const groupedWeights = useMemo(() => {
    const groups: { label: string; description: string; weights: typeof visibleWeights }[] = [];

    const smcWeights = visibleWeights.filter((w) => smcPropertyKeys.includes(w.key));
    const genWeights = visibleWeights.filter((w) => generalPropertyKeys.includes(w.key));

    if (smcWeights.length > 0) {
      groups.push({
        label: "Magnetic Properties",
        description: "Core electromagnetic performance criteria for SMC materials",
        weights: smcWeights,
      });
    }
    if (genWeights.length > 0) {
      groups.push({
        label: "General Properties",
        description: "Datasheet resistivity and ambient transverse rupture strength",
        weights: genWeights,
      });
    }

    return groups;
  }, [visibleWeights]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Step indicator */}
        <div className="mb-12">
          <div className="mx-auto flex w-full max-w-xl items-center">
              {steps.map((step, i) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <button onClick={() => goToStep(step.id)} className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 ${
                        currentStep === step.id
                          ? `hoganas-gradient-warm text-primary-foreground shadow-lg shadow-primary/20 ${step.id === "application" ? "border-transparent" : "border-primary/40"}`
                          : i < stepIndex
                            ? `${step.id === "application" ? "border-transparent" : "border-primary/30"} bg-accent/15 text-primary`
                            : `${step.id === "application" ? "border-transparent" : "border-primary/30"} bg-muted text-muted-foreground`
                      }`}
                    >
                      {i < stepIndex ? <Check className="h-4 w-4" /> : step.num}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        currentStep === step.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {i < steps.length - 1 && (
                    <div
                      className={`mx-3 mb-5 h-0.5 flex-1 rounded-full transition-colors ${i < stepIndex ? "bg-accent/30" : "bg-border"}`}
                    />
                  )}
                </div>
              ))}
          </div>

            {hasActiveFilters && currentStep !== "application" && (
              <div className="mt-5 flex items-center justify-center">
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:shadow-sm"
                >
                  <RotateCcw className="h-3 w-3" /> Reset all selections
                </button>
              </div>
            )}
        </div>

        {/* ====== STEP: SELECT APPLICATION (motor designers) ====== */}
        {currentStep === "application" && (
          <div className="animate-in fade-in duration-300">
            <AnimatedSection delay={0.05}>
              <div className="mb-10 text-center">
                <h2 className="mb-2 text-2xl font-bold text-foreground">Select Application</h2>
                <p className="mx-auto max-w-xl text-sm text-muted-foreground">
                  Choose the application you are designing for. We will show you the recommended Somaloy® grades, you
                  can fine-tune the properties on the next step.
                </p>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {motorDesignerApplications.map((app) => (
                <StaggerItem key={app.id}>
                  <button
                    onClick={() => selectApplication(app)}
                    className="group flex h-full w-full flex-col items-start rounded-xl border border-border bg-card p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <h3 className="mb-1.5 text-base font-bold text-foreground">{app.name}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{app.description}</p>
                    <div className="mt-auto w-full border-t border-border pt-3">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Recommended grades
                      </p>
                      <div className="space-y-1">
                        {app.recommendedLabels.map((label, i) => (
                          <p key={i} className="text-[11px] font-medium text-foreground">
                            <span className="mr-1.5 text-primary">{i + 1}.</span>
                            {label}
                          </p>
                        ))}
                      </div>
                    </div>
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  setSelectedApplication(null);
                  setWeights(createDefaultWeights());
                  navigateStep("properties");
                  scrollToTop();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:shadow-md"
              >
                Skip, fine-tune properties yourself <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedApplication(null);
                  setHasUserFineTuned(false);
                  setWeights(createDefaultWeights());
                  setDensityChartFamilyId(somaloyMaterialFamilies[0]?.id ?? "");
                  navigateStep("results");
                  scrollToTop();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:shadow-md"
              >
                Show all materials and compare <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === "results" && showAllCatalog && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">All materials</h2>
                <p className="mt-1 text-sm text-muted-foreground">Select a grade and density, then add the exact variant to Compare.</p>
              </div>
              <button
                onClick={() => {
                  navigateStep("application");
                  scrollToTop();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to applications
              </button>
            </div>

            <div className="grid items-start gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
              <aside className="space-y-4 xl:sticky xl:top-20">
                {densityChartFamily && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Density profile
                    </p>
                    <Select value={densityChartFamily.id} onValueChange={setDensityChartFamilyId}>
                      <SelectTrigger className="mb-3 h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {somaloyMaterialFamilies.map((family) => (
                          <SelectItem key={family.id} value={family.id} className="text-xs">
                            {family.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <RadarChart
                      size={260}
                      labels={densityChartPropertyKeys.map((key) => propertyLabels[key].label.replace(/ relative score$/, ""))}
                      datasets={densityChartFamily.variants.map((variant, index) => {
                        const density = variant.datasheet!.densityGPerCm3.toFixed(2).replace(/0$/, "").replace(/\.0$/, "");
                        const variantLabel = variant.datasheet!.variantLabel;
                        return {
                          label: `${density} g/cm³${variantLabel ? ` (${variantLabel})` : ""}`,
                          data: densityChartPropertyKeys.map((key) => getScoreProperty(variant, key) ?? 0),
                          color: chartSeriesColors[index % chartSeriesColors.length],
                        };
                      })}
                    />
                  </div>
                )}
              </aside>

              <div className="space-y-8">
                <section>
                  <h3 className="mb-4 text-base font-bold text-foreground">Somaloy grades</h3>
                  <div className="grid items-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {somaloyMaterialFamilies.map((family) => {
                      const selectedMaterial = family.variants.find((variant) => variant.id === selectedDensityByFamily[family.id])
                        ?? family.variants[0];
                      return (
                        <MaterialCard
                          key={family.id}
                          material={selectedMaterial}
                          displayName={family.name}
                          densityVariants={family.variants}
                          onDensityChange={(materialId) => selectDensityVariant(family.id, materialId)}
                          relevantProperties={scorePropertyKeys}
                          onCompare={() => onCompare(selectedMaterial)}
                          isInCompare={compareList.some((item) => item.id === selectedMaterial.id)}
                          onOpenDataSheet={(url, title) => setDataSheetModal({ url, title })}
                        />
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-base font-bold text-foreground">Uncoated materials</h3>
                  <div className="grid items-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {ironMaterials.map((material) => (
                      <MaterialCard
                        key={material.id}
                        material={material}
                        relevantProperties={scorePropertyKeys}
                        onCompare={() => onCompare(material)}
                        isInCompare={compareList.some((item) => item.id === material.id)}
                        onOpenDataSheet={(url, title) => setDataSheetModal({ url, title })}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
            <ContactCallout />
          </div>
        )}

        {/* ====== STEP: PROPERTIES ====== */}
        {currentStep === "properties" && (
          <div className="animate-in fade-in duration-300">
            <AnimatedSection delay={0.05}>
              <div className="mb-8">
                <h2 className="mb-1 text-xl font-bold text-foreground">Fine-tune Requirements</h2>
                <p className="text-sm text-muted-foreground">
                  Activate and weight the magnetic and mechanical properties most important for your SMC application.
                </p>
                {selectedApplication && (
                  <div className="mt-3 space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
                      <span className="text-xs font-medium text-foreground">{selectedApplication.name}</span>
                      <button
                        onClick={() => {
                          setSelectedApplication(null);
                          navigateStep("application");
                          scrollToTop();
                        }}
                        className="text-[10px] font-semibold text-primary hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                      Requirements are prefilled for this application based on its typical performance profile. Uncheck
                      or re-weight any property to tailor the ranking to your specific design.
                    </p>
                  </div>
                )}
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
                            className={`px-5 py-4 transition-all ${w.active ? "bg-primary/5" : "hover:bg-muted/30"}`}
                          >
                            <button
                              onClick={() => toggleProperty(w.key)}
                              className="flex w-full items-center justify-between"
                            >
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`text-sm font-medium ${w.active ? "text-foreground" : "text-muted-foreground"}`}
                                  >
                                    {propertyLabels[w.key].label}
                                  </p>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{propertyLabels[w.key].description}</p>
                              </div>
                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-colors ${
                                  w.active ? "bg-primary text-primary-foreground" : "border border-border bg-card"
                                }`}
                              >
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
                                {w.key === "coreLossLow" && (
                                  <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                    Higher priority favors lower measured core loss at 1 T / 100 Hz.
                                  </p>
                                )}
                                {w.key === "coreLossHigh" && (
                                  <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                    Higher priority favors lower measured core loss at 1 T / 1 kHz.
                                  </p>
                                )}
                                {w.key === "permeability" && (
                                  <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                    Datasheet μmax values range from 220 to 950. Higher permeability enables stronger magnetic flux.
                                  </p>
                                )}
                                {w.key === "saturationInduction" && (
                                  <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                    Portfolio B @10 kA/m values range from 1.33 to 1.63 T. Higher values support greater flux density.
                                  </p>
                                )}
                                {w.key === "resistivity" && (
                                  <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                    Reported values range from 70 to 20,000 μΩm. 7P has no resistivity value in this datasheet.
                                  </p>
                                )}
                                {w.key === "transverseRuptureStrength" && (
                                  <p className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                    Datasheet TRS values range from 33 to 140 MPa.
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
              <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                {hasScoringFilters && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Requirement Profile
                    </p>
                    <RadarChart
                      datasets={[
                        {
                          label: "Your requirements",
                          data: relevantPropertyKeys.map((key) => {
                            const w = weights.find((wt) => wt.key === key);
                            return w?.active ? w.value : 0;
                          }),
                          color: brandColors.orange,
                        },
                      ]}
                      labels={relevantPropertyKeys.map((key) => propertyLabels[key].label)}
                      size={240}
                    />
                  </div>
                )}

                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Summary
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{activeWeights.length}</span> properties active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick-activate all SMC properties */}
                <button
                  onClick={() => {
                    setHasUserFineTuned(true);
                    setWeights((prev) =>
                      prev.map((w) =>
                        smcPropertyKeys.includes(w.key) ? { ...w, active: true, value: Math.max(w.value, 70) } : w,
                      ),
                    );
                  }}
                  className="w-full rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-left transition-colors hover:bg-accent/10"
                >
                  <p className="text-xs font-semibold text-primary">Activate all magnetic properties</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Enable permeability, core losses and Bsat at once
                  </p>
                </button>
              </div>
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <button
                onClick={goNext}
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Show {visibleMaterials.length} materials
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP: RESULTS ====== */}
        {currentStep === "results" && !showAllCatalog && (
          <div className="animate-in fade-in duration-300">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              {/* Sidebar filters */}
              <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                {selectedApplication && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Selected application
                    </p>
                    <h3 className="text-sm font-semibold text-foreground">{selectedApplication.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {selectedApplication.description}
                    </p>
                  </div>
                )}

                {hasScoringFilters && <div className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Active Filters
                    </p>
                    <button
                      onClick={() => navigateStep("properties")}
                      className="text-[10px] font-medium text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {activeWeights.length > 0 ? (
                    <div className="space-y-2">
                      {activeWeights.map((w) => (
                        <div key={w.key} className="flex items-center gap-2">
                          <span className="flex-1 truncate text-xs text-foreground">{propertyLabels[w.key].label}</span>
                          <div className="w-14">
                            <div className="h-1.5 rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${w.value}%` }}
                              />
                            </div>
                          </div>
                          <span className="w-7 text-right text-[10px] font-medium text-muted-foreground">
                            {w.value}
                          </span>
                          <button
                            onClick={() => toggleProperty(w.key)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No property filters active</p>
                  )}
                </div>}

                {/* Radar overlay */}
                {(selectedApplication || (hasScoringFilters && visibleMaterials.length > 0)) && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {hasScoringFilters && visibleMaterials.length > 0 ? "Requirements vs. Best Match" : "Application Profile"}
                    </p>
                    <RadarChart
                      size={220}
                      datasets={[
                        {
                          label: selectedApplication ? "Selected properties" : "Your requirements",
                          data: radarPropertyKeys.map((key) => {
                            const w = weights.find((wt) => wt.key === key);
                            return w?.active ? w.value : 0;
                          }),
                          color: brandColors.orange,
                        },
                        ...(hasScoringFilters && visibleMaterials.length > 0
                          ? [{
                              label: visibleMaterials[0].material.name,
                              data: radarPropertyKeys.map((key) => getScoreProperty(visibleMaterials[0].material, key) ?? 0),
                              color: brandColors.blue,
                            }]
                          : []),
                      ]}
                      labels={radarPropertyKeys.map((key) => propertyLabels[key].label.replace(/ relative score$/, ""))}
                    />
                  </div>
                )}

                {!selectedApplication && !hasScoringFilters && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Property Profile
                    </p>
                    <RadarChart
                      size={220}
                      labels={comparisonProfileKeys.map((key) => propertyLabels[key].label.replace(/ relative score$/, ""))}
                      datasets={compareList.map((material, index) => ({
                        label: material.name,
                        data: comparisonProfileKeys.map((key) => getScoreProperty(material, key) ?? 0),
                        color: chartSeriesColors[index % chartSeriesColors.length],
                      }))}
                    />
                    {compareList.length === 1 && (
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brandColors.blue }} />
                        <span className="text-[10px] text-muted-foreground">{compareList[0].name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Results grid */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {hasScoringFilters
                        ? `Top ${visibleMaterials.length} matches`
                        : selectedApplication && !(hasUserFineTuned && !hasActiveFilters)
                          ? `${visibleMaterials.length} recommended grades`
                          : `All ${visibleMaterials.length} materials`}
                    </h2>
                    {selectedApplication && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        for {selectedApplication.name}
                        {" · "}
                        <button
                          onClick={() => {
                            setSelectedApplication(null);
                            navigateStep("application");
                            scrollToTop();
                          }}
                          className="font-medium text-primary hover:underline"
                        >
                          Change application
                        </button>
                      </p>
                    )}
                    {hasScoringFilters && <p className="text-xs text-muted-foreground">Ranked by requirement fit · 1 = best match</p>}
                  </div>
                  {!hasScoringFilters && (!selectedApplication || hasUserFineTuned) && (
                    <button
                      onClick={() => setSortBy(sortBy === "score" ? "name" : "score")}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      {sortBy === "score" ? "Sort by name" : "Default order"}
                    </button>
                  )}
                </div>

                <StaggerContainer
                  key={hasScoringFilters ? "ranked-results" : "all-results"}
                  className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {visibleMaterials.map(({ material }, index) => (
                    <StaggerItem key={material.id}>
                      <MaterialCard
                        material={material}
                        matchRank={hasScoringFilters ? index + 1 : undefined}
                        onCompare={() => onCompare(material)}
                        isInCompare={compareList.some((c) => c.id === material.id)}
                        relevantProperties={relevantPropertyKeys}
                        onOpenDataSheet={(url, title) => setDataSheetModal({ url, title })}
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {visibleMaterials.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border py-20 text-center">
                    <p className="text-sm font-medium text-foreground">No materials match your criteria</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try broadening your selections or resetting filters
                    </p>
                    <button
                      onClick={resetAll}
                      className="mt-4 rounded-lg bg-primary px-5 py-2 text-xs font-medium text-primary-foreground"
                    >
                      Reset all
                    </button>
                  </div>
                )}
              </div>
            </div>

            <ContactCallout />
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
            className="fixed bottom-0 left-0 right-0 z-50 w-full sm:bottom-6 sm:left-4 sm:right-4 sm:mx-auto sm:w-auto sm:max-w-[900px]"
          >
            <div className="border-t border-border/60 bg-card/95 px-4 py-3 shadow-[0_-4px_24px_-6px_hsl(var(--primary)/0.1)] backdrop-blur-2xl sm:rounded-2xl sm:border sm:border-border/40 sm:px-5 sm:shadow-[0_8px_40px_-10px_hsl(var(--primary)/0.2)]">
              <div className="flex min-w-0 items-center justify-between gap-3">
                {/* Material chips with remove */}
                <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none">
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
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompare(m);
                          }}
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
      {dataSheetModal && (
        <PdfModal url={dataSheetModal.url} title={dataSheetModal.title} onClose={() => setDataSheetModal(null)} />
      )}
    </div>
  );
};

export default SmartSelector;
