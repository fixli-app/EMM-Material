import { useState, useMemo } from "react";
import { type Material, applications } from "@/data/materials";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ExpertInsightsProps {
  materials: Material[];
}

const seriesInfo: Record<string, { label: string; color: string; summary: string; details: string }> = {
  "5P": {
    label: "5P",
    color: "bg-accent/15 text-accent border-accent/30",
    summary: "Lowest core losses — optimized for maximum magnetic efficiency",
    details:
      "The 5P treatment uses an advanced organic insulation cured in inert N₂ atmosphere at up to 650°C. This preserves the insulating layer better than steam or air, resulting in the lowest eddy current losses across the Somaloy range. Best suited for applications where core loss minimization is the primary design driver — high-efficiency motors, inductors and high-frequency power conversion.",
  },
  "3P": {
    label: "3P",
    color: "bg-primary/15 text-primary border-primary/30",
    summary: "Highest mechanical strength — for structurally demanding components",
    details:
      "The 3P treatment involves steam curing at up to 530°C, which creates an iron oxide bonding layer between particles. This significantly increases transverse rupture strength (TRS up to 140 MPa) and tensile strength, while maintaining good magnetic performance. Ideal for motor stators and rotor cores that must withstand mechanical stress, press-fit assembly or high rotational forces.",
  },
  "1P": {
    label: "1P",
    color: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
    summary: "Most economical — simple processing for cost-sensitive designs",
    details:
      "The 1P treatment uses a basic organic insulation with room-temperature die compaction and air atmosphere curing at up to 530°C. This is the most cost-effective process, requiring no heated tooling or protective gas. Suitable for high-volume production of solenoids, sensors, actuators and other cost-sensitive components where moderate magnetic performance is acceptable.",
  },
};

function getSeriesKey(category: string): string | null {
  if (category.includes("5P")) return "5P";
  if (category.includes("3P")) return "3P";
  if (category.includes("1P")) return "1P";
  return null;
}

const ExpertInsights = ({ materials }: ExpertInsightsProps) => {
  const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(() => {
    return new Set(materials.length > 0 ? [materials[0].id] : []);
  });
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());

  // Read selected application from localStorage
  const selectedAppContext = useMemo(() => {
    try {
      const stored = localStorage.getItem("hoganas-selected-apps");
      if (!stored) return null;
      const appIds: string[] = JSON.parse(stored);
      if (appIds.length === 0) return null;
      const matchedApps = applications.filter((a) => appIds.includes(a.id));
      if (matchedApps.length === 0) return null;
      return matchedApps;
    } catch {
      return null;
    }
  }, []);

  // Determine best material for the selected application
  const recommendation = useMemo(() => {
    if (!selectedAppContext || materials.length < 2) return null;

    // Collect all recommended material IDs across selected applications
    const recommendedIds = new Set(
      selectedAppContext.flatMap((a) => a.recommendedMaterials)
    );

    // Find materials in the comparison that are recommended
    const recommended = materials.filter((m) => recommendedIds.has(m.id));
    if (recommended.length === 0) return null;

    // Pick the first recommended one (highest priority in the application's list)
    const appNames = selectedAppContext.map((a) => a.name).join(" & ");
    
    // Find the best match: the one that appears earliest in any app's recommendedMaterials list
    let bestMaterial = recommended[0];
    let bestRank = Infinity;
    for (const app of selectedAppContext) {
      for (const m of recommended) {
        const rank = app.recommendedMaterials.indexOf(m.id);
        if (rank !== -1 && rank < bestRank) {
          bestRank = rank;
          bestMaterial = m;
        }
      }
    }

    return { material: bestMaterial, appNames, allRecommended: recommended };
  }, [selectedAppContext, materials]);

  const toggleMaterial = (id: string) => {
    setExpandedMaterials((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSeries = (key: string) => {
    setExpandedSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const uniqueSeries = Array.from(
    new Set(materials.map((m) => getSeriesKey(m.category)).filter(Boolean) as string[])
  );

  return (
    <div className="mt-8 rounded-xl border border-border/60 bg-gradient-to-br from-secondary/40 to-secondary/20 p-5 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z" />
            <path d="M10 21h4" />
            <path d="M12 6v2" />
          </svg>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <h4 className="text-sm font-bold tracking-tight text-foreground">Expert Insights</h4>

          {/* Application-based recommendation */}
          {recommendation && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-accent text-accent" />
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-foreground">
                    Recommendation for {recommendation.appNames}
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-accent">{recommendation.material.name}</span> is the top-recommended grade for this application
                    {recommendation.material.specifications?.["μmax"] &&
                      ` with μmax ${recommendation.material.specifications["μmax"]}`}
                    {recommendation.material.specifications?.["B@10kA/m"] &&
                      `, ${recommendation.material.specifications["B@10kA/m"]} saturation`}
                    {recommendation.material.specifications?.["Core loss 1T/1kHz"] &&
                      ` and ${recommendation.material.specifications["Core loss 1T/1kHz"]} core loss @1T/1kHz`}
                    .
                  </p>
                  {recommendation.allRecommended.length > 1 && (
                    <p className="text-[10px] text-muted-foreground/80">
                      Also recommended: {recommendation.allRecommended
                        .filter((m) => m.id !== recommendation.material.id)
                        .map((m) => m.name)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Series explainer badges */}
          {uniqueSeries.length > 0 && (
            <div className="space-y-2">
              {uniqueSeries.map((key) => {
                const info = seriesInfo[key];
                if (!info) return null;
                const isOpen = expandedSeries.has(key);
                return (
                  <div key={key} className="rounded-lg border border-border/50 bg-background/50">
                    <button
                      onClick={() => toggleSeries(key)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left"
                    >
                      <Badge variant="outline" className={`shrink-0 text-[10px] ${info.color}`}>
                        {info.label} Series
                      </Badge>
                      <span className="flex-1 text-[11px] leading-snug text-muted-foreground">
                        {info.summary}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-3 w-3 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-3 pb-3 text-[11px] leading-relaxed text-muted-foreground">
                            {info.details}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* Per-material insights */}
          <div className="space-y-1">
            {materials.map((m) => {
              const p = m.properties;
              const specs = m.specifications || {};
              const isOpen = expandedMaterials.has(m.id);
              const seriesKey = getSeriesKey(m.category);
              const isRecommended = recommendation?.material.id === m.id;

              const topProps: string[] = [];
              if (p.permeability >= 70) topProps.push(`high permeability (μmax ${specs["μmax"] || "—"})`);
              else if (p.permeability >= 40) topProps.push(`moderate permeability (μmax ${specs["μmax"] || "—"})`);
              if (p.coreLossLow >= 70) topProps.push(`excellent low-frequency core losses (${specs["Core loss 1T/100Hz"] || "—"} @1T/100Hz)`);
              if (p.coreLossHigh >= 70) topProps.push(`low high-frequency core losses (${specs["Core loss 1T/1kHz"] || "—"} @1T/1kHz)`);
              if (p.saturationInduction >= 70) topProps.push(`high saturation induction (${specs["B@10kA/m"] || "—"})`);
              if (p.resistivity >= 70) topProps.push(`very high resistivity (${specs["Resistivity"] || "—"})`);
              if (p.transverseRuptureStrength >= 70) topProps.push(`high mechanical strength (TRS ${specs["TRS"] || "—"})`);
              if (p.thermalResistance >= 70) topProps.push("good thermal resistance");
              if (p.costEfficiency >= 70) topProps.push("strong cost efficiency");

              const appText = m.applications.slice(0, 4).join(", ");

              return (
                <div
                  key={m.id}
                  className={`rounded-lg border transition-colors hover:bg-background/50 ${
                    isRecommended
                      ? "border-accent/30 bg-accent/5"
                      : "border-border/40 bg-background/30"
                  }`}
                >
                  <button
                    onClick={() => toggleMaterial(m.id)}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-foreground">{m.name}</span>
                      {isRecommended && (
                        <Badge variant="outline" className="ml-2 border-accent/30 bg-accent/10 text-[9px] text-accent">
                          Recommended
                        </Badge>
                      )}
                      {seriesKey && seriesInfo[seriesKey] && (
                        <Badge variant="outline" className={`ml-1.5 text-[9px] ${seriesInfo[seriesKey].color}`}>
                          {seriesKey}
                        </Badge>
                      )}
                      {!isOpen && (
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          — {m.category}
                        </span>
                      )}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1.5 px-3 pb-3">
                          <p className="text-[11px] leading-relaxed text-muted-foreground">
                            {m.description}
                          </p>

                          {topProps.length > 0 && (
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                              <span className="font-medium text-foreground">Key strengths:</span>{" "}
                              {topProps.join(", ")}.
                            </p>
                          )}

                          <p className="text-[11px] leading-relaxed text-muted-foreground">
                            <span className="font-medium text-foreground">Applications:</span>{" "}
                            {appText}.
                          </p>

                          {(m.typicalDensity || m.particleSize || m.temperatureRange) && (
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground/80">
                              {m.typicalDensity && <span>Density: {m.typicalDensity}</span>}
                              {m.particleSize && <span>Particles: {m.particleSize}</span>}
                              {m.temperatureRange && <span>Curing: {m.temperatureRange}</span>}
                            </div>
                          )}

                          {m.process.length > 0 && (
                            <p className="text-[10px] leading-relaxed text-muted-foreground/70">
                              <span className="font-medium text-muted-foreground">Process:</span>{" "}
                              {m.process.join(" → ")}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground italic">
            All specifications verified against official Höganäs datasheets at 800 MPa compaction (IEC 60404).
            Contact our material specialists for tailored component design advisory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertInsights;
