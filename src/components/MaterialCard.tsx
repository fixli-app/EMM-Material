import { type Material, propertyLabels } from "@/data/materials";
import { Badge } from "@/components/ui/badge";
import { Leaf, Plus, Check, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MaterialCardProps {
  material: Material;
  score?: number;
  onCompare: () => void;
  isInCompare: boolean;
  isRecommended?: boolean;
}

const MaterialCard = ({ material, score, onCompare, isInCompare, isRecommended }: MaterialCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const topProperties = Object.entries(material.properties)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className={`group relative rounded-xl border p-5 transition-all hover:hoganas-shadow ${
      isRecommended ? "border-accent/30 bg-accent/5" : "border-border bg-card"
    }`}>
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -left-1 top-3 rounded-r-md bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
          ⭐ Rekommenderad
        </div>
      )}
      {score !== undefined && score > 0 && (
        <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground hoganas-shadow">
          {score}
        </div>
      )}

      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">{material.name}</h3>
            {material.isRe && (
              <Leaf className="h-4 w-4 text-hoganas-success" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">
              {material.brand === "Astaloy" || material.brand === "Distaloy"
                ? `${material.brand}®`
                : material.brand}
            </Badge>
            <span className="text-xs text-muted-foreground">{material.category}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {material.description}
      </p>

      {/* Top properties bars */}
      <div className="mb-3 space-y-1.5">
        {topProperties.map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-24 truncate text-[11px] text-muted-foreground">
              {propertyLabels[key as keyof Material["properties"]].label}
            </span>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
            <span className="w-8 text-right text-[11px] font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mb-3 space-y-3 border-t border-border pt-3">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Legeringssammansättning</p>
            <p className="text-xs text-foreground">{material.alloyComposition}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fördelar</p>
            <ul className="space-y-0.5">
              {material.benefits.map((b) => (
                <li key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Process</p>
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
              Öppna datablad
            </a>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? "Mindre" : "Detaljer"}
        </button>
        <button
          onClick={onCompare}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isInCompare
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {isInCompare ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {isInCompare ? "I jämförelse" : "Jämför"}
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
