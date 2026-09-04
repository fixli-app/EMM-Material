import { useState, useMemo } from "react";
import { type Material, motorDesignerApplications } from "@/data/materials";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ExpertInsightsProps {
  materials: Material[];
}

const seriesBadgeColors: Record<string, string> = {
  "7P": "bg-hoganas-success/15 text-hoganas-success border-hoganas-success/30",
  "5P": "bg-accent/15 text-accent border-accent/30",
  "3P": "bg-primary/15 text-primary border-primary/30",
  "1P": "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};

function getSeriesKey(category: string): string | null {
  if (category.includes("7P")) return "7P";
  if (category.includes("5P")) return "5P";
  if (category.includes("3P")) return "3P";
  if (category.includes("1P")) return "1P";
  return null;
}

const ExpertInsights = ({ materials }: ExpertInsightsProps) => {
  const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(() => {
    return new Set(materials.length > 0 ? [materials[0].id] : []);
  });

  const selectedAppContext = useMemo(() => {
    try {
      const appId = localStorage.getItem("hoganas-selected-application");
      if (!appId) return null;
      return motorDesignerApplications.find((a) => a.id === appId) ?? null;
    } catch {
      return null;
    }
  }, []);

  // Fallback when no application has been selected: pick the material with the
  // strongest overall property profile (highest average of normalized values).
  const propertyBestMatch = useMemo(() => {
    if (materials.length < 2) return null;
    const keys = [
      "permeability",
      "coreLossLow",
      "coreLossHigh",
      "saturationInduction",
      "resistivity",
      "transverseRuptureStrength",
      "thermalResistance",
      "costEfficiency",
    ] as const;
    const scored = materials.map((m) => {
      const total = keys.reduce((sum, k) => sum + (m.properties[k] ?? 0), 0);
      return { material: m, avg: total / keys.length };
    });
    scored.sort((a, b) => b.avg - a.avg);
    if (scored[0].avg === scored[1].avg) return null; // no clear winner
    return scored[0].material;
  }, [materials]);

  const recommendation = useMemo(() => {
    if (!selectedAppContext || materials.length < 2) return null;
    // Rank each compared material by its position in the curated
    // recommendation groups (rank 1 = first group, etc.).
    const rankById = new Map<string, number>();
    selectedAppContext.recommendedGroups.forEach((group, rank) => {
      group.forEach((id) => rankById.set(id, rank));
    });
    const recommended = materials
      .filter((m) => rankById.has(m.id))
      .sort((a, b) => (rankById.get(a.id) ?? 0) - (rankById.get(b.id) ?? 0));
    if (recommended.length === 0) return null;

    const bestRank = rankById.get(recommended[0].id) ?? 0;
    const bestLabel = selectedAppContext.recommendedLabels[bestRank] ?? recommended[0].name;

    return {
      material: recommended[0],
      bestLabel,
      appName: selectedAppContext.name,
      allRecommended: recommended,
    };
  }, [selectedAppContext, materials]);

  const toggleMaterial = (id: string) => {
    setExpandedMaterials((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
                    Recommendation for {recommendation.appName}
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-accent">{recommendation.bestLabel}</span> is the top-recommended grade for this application
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

          {/* Property-based best match (no application selected) */}
          {!recommendation && propertyBestMatch && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-accent text-accent" />
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-foreground">Best Match</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-accent">{propertyBestMatch.name}</span> has the strongest overall property profile in this comparison
                    {propertyBestMatch.specifications?.["μmax"] &&
                      ` with μmax ${propertyBestMatch.specifications["μmax"]}`}
                    {propertyBestMatch.specifications?.["B@10kA/m"] &&
                      `, ${propertyBestMatch.specifications["B@10kA/m"]} saturation`}
                    {propertyBestMatch.specifications?.["Core loss 1T/1kHz"] &&
                      ` and ${propertyBestMatch.specifications["Core loss 1T/1kHz"]} core loss @1T/1kHz`}
                    .
                  </p>
                  <p className="text-[10px] text-muted-foreground/80">
                    Based on normalized datasheet properties (0–100). Select an application via the Motor Designers / Design Engineers path for a tailored recommendation.
                  </p>
                </div>
              </div>
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
                    isRecommended ? "border-accent/30 bg-accent/5" : "border-border/40 bg-background/30"
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
                      {seriesKey && seriesBadgeColors[seriesKey] && (
                        <Badge variant="outline" className={`ml-1.5 text-[9px] ${seriesBadgeColors[seriesKey]}`}>
                          {seriesKey}
                        </Badge>
                      )}
                      {!isOpen && (
                        <span className="ml-2 text-[11px] text-muted-foreground">— {m.category}</span>
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
                          <p className="text-[11px] leading-relaxed text-muted-foreground">{m.description}</p>

                          {topProps.length > 0 && (
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                              <span className="font-medium text-foreground">Key strengths:</span> {topProps.join(", ")}.
                            </p>
                          )}

                          <p className="text-[11px] leading-relaxed text-muted-foreground">
                            <span className="font-medium text-foreground">Applications:</span> {appText}.
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
                              <span className="font-medium text-muted-foreground">Process:</span> {m.process.join(" → ")}
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
            Contact our material specialists for tailored component design advisory and process optimization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertInsights;
