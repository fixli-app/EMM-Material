import { useMemo, useState } from "react";
import PdfModal from "./PdfModal";
import { type Material, propertyLabels } from "@/data/materials";
import RadarChart from "./RadarChart";
import ExpertInsights from "./ExpertInsights";
import { Badge } from "@/components/ui/badge";
import { X, Leaf, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

type PropertyKey = keyof Material["properties"];

interface ComparisonViewProps {
  materials: Material[];
  onRemove: (id: string) => void;
}

const colors = [
  "hsl(210, 85%, 25%)",
  "hsl(200, 75%, 40%)",
  "hsl(38, 75%, 55%)",
  "hsl(152, 60%, 40%)",
  "hsl(0, 72%, 51%)",
];

const ComparisonView = ({ materials, onRemove }: ComparisonViewProps) => {
  const [dataSheetModal, setDataSheetModal] = useState<{ url: string; title: string } | null>(null);
  // Only show properties where at least one material has a value > 10
  const relevantKeys = useMemo(() => {
    const allKeys = Object.keys(propertyLabels) as PropertyKey[];
    return allKeys.filter((key) =>
      materials.some((m) => m.properties[key] > 10)
    );
  }, [materials]);

  if (materials.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto max-w-md">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Compare Materials</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Add materials from the Material Selector to compare them side by side. You can compare up to 5 materials.
          </p>
          <Link
            to="/selector"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Material Selector
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AnimatedSection>
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Comparison</h2>
          <p className="text-sm text-muted-foreground">
            {materials.length} materials selected · Showing {relevantKeys.length} relevant properties
          </p>
        </div>
      </AnimatedSection>

      {/* Radar overlay */}
      <AnimatedSection delay={0.1}>
      <div className="mb-8 flex justify-center rounded-xl border border-border bg-card p-4 sm:p-6">
        <RadarChart
          size={320}
          labels={relevantKeys.map((k) => propertyLabels[k].label)}
          datasets={materials.map((m, i) => ({
            label: m.name,
            data: relevantKeys.map((k) => m.properties[k]),
            color: colors[i % colors.length],
          }))}
        />
      </div>
      </AnimatedSection>

      {/* Comparison table */}
      <AnimatedSection delay={0.2}>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="min-w-[600px] overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Property
              </th>
              {materials.map((m, i) => (
                <th key={m.id} className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    />
                    <span className="text-xs font-bold text-foreground">{m.name}</span>
                    {m.isRe && <Leaf className="h-3 w-3 text-hoganas-success" />}
                    <button
                      onClick={() => onRemove(m.id)}
                      className="ml-1 rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Meta rows */}
            <tr className="border-b border-border">
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Brand</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-2.5 text-center">
                  <Badge variant="outline" className="text-[10px]">{m.brand}</Badge>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Category</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-2.5 text-center text-xs text-foreground">{m.category}</td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Alloy</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-2.5 text-center text-xs text-foreground">{m.alloyComposition}</td>
              ))}
            </tr>
            {materials.some((m) => m.typicalDensity) && (
            <tr className="border-b border-border">
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Typical Density</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-2.5 text-center text-xs text-foreground">{m.typicalDensity || "—"}</td>
              ))}
            </tr>
            )}
            {/* Relevant properties only */}
            {relevantKeys.map((key) => {
              const values = materials.map((m) => m.properties[key]);
              const max = Math.max(...values);
              return (
                <tr key={key} className="border-b border-border">
                  <td className="px-4 py-2.5">
                    <div className="text-xs font-medium text-muted-foreground">
                      {propertyLabels[key].label}
                    </div>
                    {propertyLabels[key].unit && (
                      <span className="text-[9px] text-muted-foreground/60">{propertyLabels[key].unit}</span>
                    )}
                  </td>
                  {materials.map((m) => {
                    const val = m.properties[key];
                    const isTop = val === max && materials.length > 1 && val > 0;
                    return (
                      <td key={m.id} className="px-4 py-2.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-semibold ${isTop ? "text-accent" : "text-foreground"}`}>
                            {val}
                          </span>
                          <div className="h-1 w-16 rounded-full bg-secondary">
                            <div
                              className={`h-full rounded-full ${isTop ? "bg-accent" : "bg-primary"}`}
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* Key specifications from datasheets */}
            {materials.some((m) => m.specifications && Object.keys(m.specifications).length > 0) && (
              <>
                <tr className="border-b border-border bg-muted/30">
                  <td colSpan={materials.length + 1} className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Datasheet Specifications
                  </td>
                </tr>
                {(() => {
                  const allSpecKeys = new Set<string>();
                  materials.forEach((m) => {
                    if (m.specifications) Object.keys(m.specifications).forEach((k) => allSpecKeys.add(k));
                  });
                  return Array.from(allSpecKeys).map((specKey) => (
                    <tr key={specKey} className="border-b border-border">
                      <td className="px-4 py-2 text-xs font-medium text-muted-foreground">{specKey}</td>
                      {materials.map((m) => (
                        <td key={m.id} className="px-4 py-2 text-center text-xs text-foreground">
                          {m.specifications?.[specKey] || "—"}
                        </td>
                      ))}
                    </tr>
                  ));
                })()}
              </>
            )}
            {/* Data sheet links */}
            <tr>
              <td className="px-4 py-3 text-xs font-medium text-muted-foreground">Data Sheet</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-3 text-center">
                 {m.dataSheetUrl ? (
                    <button
                      onClick={() => setDataSheetModal({ url: m.dataSheetUrl!, title: `${m.name} — Technical Data Sheet` })}
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                    >
                      <FileText className="h-3 w-3" />
                      PDF
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      </AnimatedSection>

      {/* Expert insight */}
      <div className="mt-8 rounded-xl border border-border/60 bg-gradient-to-br from-secondary/40 to-secondary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/><path d="M10 21h4"/><path d="M12 6v2"/></svg>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-tight text-foreground">Expert Insights</h4>
            {materials.map((m) => {
              const p = m.properties;
              const specs = m.specifications || {};
              const topProps: string[] = [];

              // Use actual datasheet values where available
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
                <div key={m.id} className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">{m.name} <span className="font-normal text-muted-foreground">— {m.category}</span></p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                  {topProps.length > 0 && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">Key strengths:</span> {topProps.join(", ")}.
                    </p>
                  )}
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Typical applications:</span> {appText}.
                  </p>
                  {m.typicalDensity && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Density: {m.typicalDensity}.{m.particleSize ? ` Particle size: ${m.particleSize}.` : ""}{m.temperatureRange ? ` Curing: ${m.temperatureRange}.` : ""}
                    </p>
                  )}
                </div>
              );
            })}
            <p className="text-xs leading-relaxed text-muted-foreground italic">
              Contact our material specialists for tailored component design advisory and process optimization.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ExternalLink className="h-4 w-4" />
          Request quote for selected materials
        </Link>
      </div>
      {dataSheetModal && (
        <PdfModal
          url={dataSheetModal.url}
          title={dataSheetModal.title}
          onClose={() => setDataSheetModal(null)}
        />
      )}
    </div>
  );
};

export default ComparisonView;
