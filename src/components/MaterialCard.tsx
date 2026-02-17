import { type Material, propertyLabels } from "@/data/materials";
import { Badge } from "@/components/ui/badge";
import { Leaf, Plus, Check, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type PropertyKey = keyof Material["properties"];

interface MaterialCardProps {
  material: Material;
  score?: number;
  onCompare: () => void;
  isInCompare: boolean;
  isRecommended?: boolean;
  relevantProperties?: PropertyKey[];
}

const MaterialCard = ({ material, score, onCompare, isInCompare, isRecommended, relevantProperties }: MaterialCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Only show properties relevant to the context, sorted by value
  const displayProperties = (relevantProperties || (Object.keys(material.properties) as PropertyKey[]))
    .filter((key) => material.properties[key] > 15) // Hide near-zero irrelevant values
    .sort((a, b) => material.properties[b] - material.properties[a])
    .slice(0, 4);

  const brandDisplay = material.brand === "Astaloy" || material.brand === "Distaloy" || material.brand === "Somaloy" || material.brand === "BrazeLet"
    ? `${material.brand}\u00AE`
    : material.brand;

  return (
    <div className={`group relative flex flex-col rounded-xl border transition-all hover:shadow-md ${
      isRecommended ? "border-accent/30 bg-accent/5" : "border-border bg-card"
    }`}>
      {/* Recommended tag */}
      {isRecommended && (
        <div className="absolute -left-px top-4 rounded-r-md bg-accent px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-accent-foreground">
          RECOMMENDED
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
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Alloy Composition</p>
              <p className="text-xs text-foreground">{material.alloyComposition}</p>
            </div>
            {material.typicalDensity && (
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Typical Density</p>
                <p className="text-xs text-foreground">{material.typicalDensity}</p>
              </div>
            )}
            {material.temperatureRange && (
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Temperature Range</p>
                <p className="text-xs text-foreground">{material.temperatureRange}</p>
              </div>
            )}
            {material.particleSize && (
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Particle Size</p>
                <p className="text-xs text-foreground">{material.particleSize}</p>
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
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Process</p>
              <div className="flex flex-wrap gap-1">
                {material.process.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                ))}
              </div>
            </div>
            {material.dataSheetUrl && (
              <a
                href={material.dataSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Technical data sheet
              </a>
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
