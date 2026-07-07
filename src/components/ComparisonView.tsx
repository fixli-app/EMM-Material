import { useMemo, useState } from "react";
import PdfModal from "./PdfModal";
import { type Material, propertyLabels } from "@/data/materials";
import RadarChart from "./RadarChart";
import ExpertInsights from "./ExpertInsights";
import { Badge } from "@/components/ui/badge";
import { X, Leaf, ExternalLink, FileText, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const seriesDescriptions: Record<string, { label: string; description: string }> = {
  "7P": {
    label: "7P — Next generation, lowest losses",
    description: "Innovative water-based coating cured in N₂ + 1% O₂ at 620°C. Delivers the lowest core losses in the Somaloy range with a low carbon footprint, and TRS that can be doubled through optimised part-curing. Offered in several densities (7.3–7.5 g/cm³) — higher density gives higher permeability and saturation. Ideal for efficient electric motors.",
  },
  "5P": {
    label: "5P — Lowest core losses",
    description: "Advanced organic insulation cured in inert N₂ at up to 650°C. Preserves the insulating layer for the lowest eddy current losses. Best for high-efficiency motors, inductors and high-frequency power conversion.",
  },
  "3P": {
    label: "3P — Highest mechanical strength",
    description: "Steam curing at up to 530°C creates an iron oxide bonding layer. TRS up to 140 MPa. Ideal for motor stators/rotors that must withstand press-fit assembly or high rotational forces.",
  },
  "1P": {
    label: "1P — Most economical",
    description: "Basic organic insulation with room-temperature die compaction and air curing at up to 530°C. No heated tooling or protective gas needed. Best for high-volume cost-sensitive components.",
  },
};


function getSeriesKey(cat: string): string | null {
  if (cat.includes("7P")) return "7P";
  if (cat.includes("5P")) return "5P";
  if (cat.includes("3P")) return "3P";
  if (cat.includes("1P")) return "1P";
  return null;
}

const SeriesInfoButton = ({ materials }: { materials: Material[] }) => {
  const uniqueSeries = Array.from(
    new Set(materials.map((m) => getSeriesKey(m.category)).filter(Boolean) as string[])
  );
  if (uniqueSeries.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary">
          <Info className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-72 p-3 sm:w-80">
        <p className="mb-2 text-[11px] font-semibold text-foreground">Somaloy Series Explained</p>
        <div className="space-y-2">
          {uniqueSeries.map((key) => {
            const info = seriesDescriptions[key];
            if (!info) return null;
            return (
              <div key={key}>
                <p className="text-[11px] font-medium text-foreground">{info.label}</p>
                <p className="text-[10px] leading-relaxed text-muted-foreground">{info.description}</p>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

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
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  Category
                  <SeriesInfoButton materials={materials} />
                </span>
              </td>
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

      <ExpertInsights materials={materials} />

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ExternalLink className="h-4 w-4" />
          Request sample or advisory for selected materials
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
