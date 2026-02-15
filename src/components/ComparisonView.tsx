import { type Material, propertyLabels } from "@/data/materials";
import RadarChart from "./RadarChart";
import { Badge } from "@/components/ui/badge";
import { X, Leaf, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";

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
  if (materials.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto max-w-md">
          <div className="mb-4 text-5xl">⚖️</div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Jämför material</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Lägg till material från Materialväljaren för att jämföra dem sida vid sida. Du kan jämföra upp till 5 material.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Gå till Materialväljaren
          </Link>
        </div>
      </div>
    );
  }

  const allPropertyKeys = Object.keys(propertyLabels) as PropertyKey[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Jämförelse</h2>
        <p className="text-sm text-muted-foreground">
          {materials.length} material valda (max 5)
        </p>
      </div>

      {/* Radar overlay */}
      <div className="mb-8 flex justify-center rounded-xl border border-border bg-card p-6">
        <RadarChart
          size={320}
          labels={Object.values(propertyLabels).map((p) => p.label)}
          datasets={materials.map((m, i) => ({
            label: m.name,
            data: allPropertyKeys.map((k) => m.properties[k]),
            color: colors[i % colors.length],
          }))}
        />
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Egenskap
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
            {/* Brand row */}
            <tr className="border-b border-border">
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Varumärke</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-2.5 text-center">
                  <Badge variant="outline" className="text-[10px]">{m.brand}</Badge>
                </td>
              ))}
            </tr>
            {/* Category row */}
            <tr className="border-b border-border">
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Kategori</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-2.5 text-center text-xs text-foreground">{m.category}</td>
              ))}
            </tr>
            {/* Alloy */}
            <tr className="border-b border-border">
              <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Legering</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-2.5 text-center text-xs text-foreground">{m.alloyComposition}</td>
              ))}
            </tr>
            {/* Properties */}
            {allPropertyKeys.map((key) => {
              const values = materials.map((m) => m.properties[key]);
              const max = Math.max(...values);
              return (
                <tr key={key} className="border-b border-border">
                  <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    {propertyLabels[key].label}
                  </td>
                  {materials.map((m) => {
                    const val = m.properties[key];
                    const isTop = val === max && materials.length > 1;
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
            {/* Data sheet links */}
            <tr>
              <td className="px-4 py-3 text-xs font-medium text-muted-foreground">Datablad</td>
              {materials.map((m) => (
                <td key={m.id} className="px-4 py-3 text-center">
                  {m.dataSheetUrl ? (
                    <a
                      href={m.dataSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                    >
                      <FileText className="h-3 w-3" />
                      PDF
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Expert insight */}
      <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">💡</div>
          <div>
            <h4 className="mb-1 text-sm font-bold text-foreground">Expertinsikter</h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {materials.length === 1 && `${materials[0].name} erbjuder ${materials[0].benefits[0]?.toLowerCase()}. Kontakta oss för detaljerad processrådgivning.`}
              {materials.length >= 2 && (
                <>
                  Vid val mellan {materials.map(m => m.name).join(" och ")} – tänk på att{" "}
                  {materials[0].properties.costEfficiency > materials[1].properties.costEfficiency
                    ? `${materials[0].name} är mer kostnadseffektivt`
                    : `${materials[1].name} erbjuder bättre kostnadseffektivitet`
                  }, medan{" "}
                  {materials[0].properties.tensileStrength > materials[1].properties.tensileStrength
                    ? `${materials[0].name} har högre draghållfasthet`
                    : `${materials[1].name} presterar bättre i draghållfasthet`
                  }. Kontakta våra materialspecialister för skräddarsydd rådgivning.
                </>
              )}
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
          Begär offert för valda material
        </Link>
      </div>
    </div>
  );
};

export default ComparisonView;
