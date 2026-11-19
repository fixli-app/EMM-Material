import { getScoreProperty, type Material, type ScorePropertyKey, propertyLabels } from "@/data/materials";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Plus, Check, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface MaterialCardProps {
  material: Material;
  score?: number;
  matchRank?: number;
  onCompare: () => void;
  isInCompare: boolean;
  isRecommended?: boolean;
  relevantProperties?: ScorePropertyKey[];
  onOpenDataSheet?: (url: string, title: string) => void;
  displayName?: string;
  densityVariants?: Material[];
  onDensityChange?: (materialId: string) => void;
}

const formatDensity = (density: number) => density.toFixed(2).replace(/0$/, "").replace(/\.0$/, "");

const MaterialCard = ({ material, score, matchRank, onCompare, isInCompare, isRecommended, relevantProperties, onOpenDataSheet, displayName, densityVariants, onDensityChange }: MaterialCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [specificationsExpanded, setSpecificationsExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
    setDescriptionExpanded(false);
    setSpecificationsExpanded(false);
  }, [material.id]);

  const displayProperties = (relevantProperties || (Object.keys(propertyLabels) as ScorePropertyKey[]))
    .map((key) => ({ key, value: getScoreProperty(material, key) }))
    .filter((entry): entry is { key: ScorePropertyKey; value: number } => entry.value !== undefined && entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const brandDisplay = material.brand === "Somaloy"
    ? `${material.brand}®`
    : material.brand;
  const specificationEntries = Object.entries(material.specifications ?? {});
  const compactSpecificationKeys = [
    "Density",
    "B@10kA/m",
    "μmax",
    "Core loss 1T/100Hz",
    "Core loss 1T/1kHz",
    "Resistivity",
    "TRS",
  ];
  const compactSpecifications = compactSpecificationKeys
    .flatMap((key) => {
      const entry = specificationEntries.find(([specificationKey]) => specificationKey === key);
      return entry ? [entry] : [];
    })
    .concat(specificationEntries.length > 0 && !compactSpecificationKeys.some((key) => specificationEntries.some(([specificationKey]) => specificationKey === key))
      ? specificationEntries.slice(0, 6)
      : []);
  const visibleSpecifications = specificationsExpanded ? specificationEntries : compactSpecifications;

  return (
    <div className={`group relative flex flex-col rounded-xl border transition-all hover:shadow-md ${
      isRecommended ? "border-accent/30 bg-accent/5" : "border-border bg-card"
    }`}>
      {/* Recommended tag, above header */}
      {isRecommended && (
        <div className="flex items-center gap-1.5 rounded-t-xl bg-accent px-4 py-1.5">
          <span className="text-[10px] font-bold tracking-wider text-accent-foreground">RECOMMENDED</span>
        </div>
      )}




      {/* Score badge */}
      {(matchRank !== undefined || (score !== undefined && score > 0)) && (
        <div
          className="absolute -right-2 -top-2 flex h-10 min-w-10 items-center justify-center rounded-full bg-primary px-1.5 text-sm font-bold text-primary-foreground shadow-md"
          aria-label={matchRank !== undefined ? `Match rank ${matchRank}` : undefined}
          title={matchRank !== undefined ? `Match rank ${matchRank}` : undefined}
        >
          {matchRank ?? score}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">{displayName ?? material.name}</h3>
            {material.isRe && <Leaf className="h-3.5 w-3.5 text-hoganas-success" />}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-semibold">
              {brandDisplay}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{material.category}</span>
          </div>
          {densityVariants && densityVariants.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] font-medium text-muted-foreground">Density</span>
              <Select value={material.id} onValueChange={onDensityChange}>
                <SelectTrigger className="h-7 w-40 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {densityVariants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id} className="text-xs">
                      {formatDensity(variant.datasheet!.densityGPerCm3)} g/cm³
                      {variant.datasheet!.variantLabel ? ` (${variant.datasheet!.variantLabel})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className={`text-xs leading-relaxed text-muted-foreground ${descriptionExpanded ? "" : "line-clamp-2"}`}>
            {material.description}
          </p>
          <button
            type="button"
            aria-expanded={descriptionExpanded}
            onClick={() => setDescriptionExpanded((value) => !value)}
            className="mt-1 text-[10px] font-medium text-primary hover:underline"
          >
            {descriptionExpanded ? "Read less" : "Read more"}
          </button>
        </div>

        {/* Relevant property bars */}
        <div className="mb-4 space-y-2">
          {displayProperties.map(({ key, value }) => {
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
            {/* Technical specifications from datasheet, most important, shown first */}
            {material.specifications && Object.keys(material.specifications).length > 0 && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Key Specifications</p>
                <dl className="divide-y divide-border/70 border-y border-border/70">
                  {visibleSpecifications.map(([key, val]) => (
                    <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,55%)] items-start gap-3 py-2">
                      <dt className="min-w-0 break-words text-[10px] leading-relaxed text-muted-foreground">{key}</dt>
                      <dd className="min-w-0 break-words text-right text-[11px] font-semibold leading-relaxed text-foreground">{val}</dd>
                    </div>
                  ))}
                </dl>
                {specificationEntries.length > compactSpecifications.length && (
                  <button
                    type="button"
                    aria-expanded={specificationsExpanded}
                    onClick={() => setSpecificationsExpanded((value) => !value)}
                    className="mt-2 text-[10px] font-medium text-primary hover:underline"
                  >
                    {specificationsExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            )}
            {material.benefits.length > 0 && (
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
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
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
