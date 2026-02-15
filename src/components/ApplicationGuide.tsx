import { applications, industries, materials, type Application } from "@/data/materials";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface ApplicationGuideProps {
  onCompare: (material: import("@/data/materials").Material) => void;
  compareList: import("@/data/materials").Material[];
}

const ApplicationGuide = ({ onCompare, compareList }: ApplicationGuideProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApps = selectedIndustry
    ? applications.filter((a) => a.industries.includes(selectedIndustry))
    : applications;

  const getRecommendedMaterials = (app: Application) =>
    materials.filter((m) => app.recommendedMaterials.includes(m.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Applikationsguide
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          Välj din bransch och applikation för skräddarsydda materialrekommendationer från Höganäs.
        </p>
      </div>

      {/* Industries */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Välj bransch
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setSelectedIndustry(null); setSelectedApp(null); }}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              !selectedIndustry
                ? "border-primary bg-primary text-primary-foreground hoganas-shadow"
                : "border-border bg-card text-foreground hover:border-primary/30"
            }`}
          >
            🌐 Alla branscher
          </button>
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => { setSelectedIndustry(ind.id); setSelectedApp(null); }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                selectedIndustry === ind.id
                  ? "border-primary bg-primary text-primary-foreground hoganas-shadow"
                  : "border-border bg-card text-foreground hover:border-primary/30"
              }`}
            >
              {ind.icon} {ind.name}
            </button>
          ))}
        </div>
      </div>

      {/* Applications grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => {
          const isSelected = selectedApp?.id === app.id;
          const recommended = getRecommendedMaterials(app);

          return (
            <div
              key={app.id}
              className={`cursor-pointer rounded-xl border p-5 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 hoganas-shadow"
                  : "border-border bg-card hover:border-primary/30 hover:hoganas-shadow"
              }`}
              onClick={() => setSelectedApp(isSelected ? null : app)}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{app.icon}</span>
                <h3 className="text-base font-bold text-foreground">{app.name}</h3>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{app.description}</p>

              <div className="flex flex-wrap gap-1">
                {app.requiredProperties.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">
                    {p === "tensileStrength" ? "Styrka" :
                     p === "hardness" ? "Hårdhet" :
                     p === "wearResistance" ? "Slitstyrka" :
                     p === "corrosionResistance" ? "Korrosion" :
                     p === "thermalResistance" ? "Värme" :
                     p === "fatigue" ? "Utmattning" :
                     p === "compressibility" ? "Kompressibilitet" :
                     p === "costEfficiency" ? "Kostnad" :
                     p === "sustainability" ? "Hållbarhet" :
                     p}
                  </Badge>
                ))}
              </div>

              {isSelected && recommended.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Rekommenderade material
                  </p>
                  <div className="space-y-2">
                    {recommended.map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                        <span className="text-xs font-medium text-foreground">{m.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onCompare(m); }}
                          className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                            compareList.some((c) => c.id === m.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          {compareList.some((c) => c.id === m.id) ? "Tillagd ✓" : "+ Jämför"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scenario section */}
      <div className="mt-12 rounded-xl hoganas-gradient p-8 text-center">
        <h3 className="mb-2 text-xl font-bold text-primary-foreground">
          Välj din utmaning
        </h3>
        <p className="mx-auto mb-6 max-w-lg text-sm text-primary-foreground/80">
          Berätta om din specifika utmaning – kombinera krav som hög temperatur + korrosion – och våra specialister hjälper dig hitta den optimala lösningen.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/90"
        >
          Kontakta en specialist
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default ApplicationGuide;
