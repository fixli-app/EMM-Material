import { type Material, propertyLabels } from "@/data/materials";
import { Badge } from "@/components/ui/badge";
import { Leaf, Plus, Check, ExternalLink, ChevronDown, ChevronUp, Award } from "lucide-react";
import { useState } from "react";

type PropertyKey = keyof Material["properties"];

interface MaterialCardProps {
  material: Material;
  score?: number;
  onCompare: () => void;
  isInCompare: boolean;
  isRecommended?: boolean;
  isMostEcoFriendly?: boolean;
  relevantProperties?: PropertyKey[];
  onOpenDataSheet?: (url: string, title: string) => void;
}

const MaterialCard = ({ material, score, onCompare, isInCompare, isRecommended, isMostEcoFriendly, relevantProperties, onOpenDataSheet }: MaterialCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Only show properties relevant to the context, sorted by value — hide zero/near-zero
  const displayProperties = (relevantProperties || (Object.keys(material.properties) as PropertyKey[]))
    .filter((key) => material.properties[key] > 10)
    .sort((a, b) => material.properties[b] - material.properties[a])
    .slice(0, 5);

  const brandDisplay = material.brand === "Somaloy"
    ? `${material.brand}®`
    : material.brand;

  return (
    <div className={`group relative flex flex-col rounded-xl border transition-all hover:shadow-md ${
      isRecommended ? "border-accent/30 bg-accent/5" : "border-border bg-card"
    }`}>
      {/* Recommended tag — above header */}
      {isRecommended && (
        <div className="flex items-center gap-1.5 rounded-t-xl bg-accent px-4 py-1.5">
          <span className="text-[10px] font-bold tracking-wider text-accent-foreground">RECOMMENDED</span>
        </div>
      )}




      {/* Score badge */}
      {score !== undefined && score > 0 && (
        <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
          {score}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">{material.name}</h3>
            {material.isRe && <Leaf className="h-3.5 w-3.5 text-hoganas-success" />}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-semibold">
              {brandDisplay}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{material.category}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {material.description}
        </p>

        {/* Relevant property bars */}
        <div className="mb-4 space-y-2">
          {displayProperties.map((key) => {
            const value = material.properties[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="w-24 truncate text-[11px] text-muted-foreground">
                  {propertyLabels[key].label}
                </span>
                <div className="flex-1">
                  <div className="h-1.5 rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${
                        value >= 80 ? "bg-accent" : "bg-primary"
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
                <span className="w-7 text-right text-[10px] font-semibold text-foreground">{value}</span>
              </div>
            );
          })}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mb-4 space-y-3 border-t border-border pt-3">
            {/* Technical specifications from datasheet — most important, shown first */}
            {material.specifications && Object.keys(material.specifications).length > 0 && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Key Specifications</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {Object.entries(material.specifications).map(([key, val]) => (
                    <div key={key} className="flex items-baseline justify-between gap-1">
                      <span className="text-[10px] text-muted-foreground">{key}</span>
                      <span className="text-[11px] font-semibold text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Key Benefits</p>
              <ul className="space-y-0.5">
                {material.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            {/* Product facts — supporting detail below the benefits */}
            {(material.alloyComposition || material.typicalDensity || material.temperatureRange || material.particleSize) && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product Details</p>
                <dl className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                  {material.alloyComposition && (
                    <div>
                      <dt className="text-[9px] uppercase tracking-wider text-muted-foreground/80">Alloy Composition</dt>
                      <dd className="mt-0.5 text-xs leading-relaxed text-foreground">{material.alloyComposition}</dd>
                    </div>
                  )}
                  {material.typicalDensity && (
                    <div>
                      <dt className="text-[9px] uppercase tracking-wider text-muted-foreground/80">Typical Density</dt>
                      <dd className="mt-0.5 text-xs leading-relaxed text-foreground">{material.typicalDensity}</dd>
                    </div>
                  )}
                  {material.temperatureRange && (
                    <div>
                      <dt className="text-[9px] uppercase tracking-wider text-muted-foreground/80">Temperature Range</dt>
                      <dd className="mt-0.5 text-xs leading-relaxed text-foreground">{material.temperatureRange}</dd>
                    </div>
                  )}
                  {material.particleSize && (
                    <div>
                      <dt className="text-[9px] uppercase tracking-wider text-muted-foreground/80">Particle Size</dt>
                      <dd className="mt-0.5 text-xs leading-relaxed text-foreground">{material.particleSize}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            {material.applications && material.applications.length > 0 && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Can be used for the following applications</p>
                <div className="flex flex-wrap gap-1">
                  {material.applications.map((a) => (
                    <Badge key={a} variant="outline" className="text-[10px] font-medium">{a}</Badge>
                  ))}
                </div>
                <p className="mt-1.5 text-[10px] italic text-muted-foreground/70">
                  Matching based on product datasheet and technical metadata
                </p>
              </div>
            )}
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Process</p>
              <div className="flex flex-wrap gap-1">
                {material.process.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                ))}
              </div>
            </div>
            {material.dataSheetUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDataSheet?.(material.dataSheetUrl!, material.name);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Technical data sheet
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Less" : "Details"}
          </button>
          <button
            onClick={onCompare}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isInCompare
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {isInCompare ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            {isInCompare ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
