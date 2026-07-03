import { applications, industries, materials, type Application } from "@/data/materials";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const MAX_DESC_LENGTH = 90;

interface ApplicationGuideProps {
  onCompare: (material: import("@/data/materials").Material) => void;
  compareList: import("@/data/materials").Material[];
}

const ApplicationGuide = ({ onCompare, compareList }: ApplicationGuideProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [expandedDescs, setExpandedDescs] = useState<Set<string>>(new Set());

  const toggleDesc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDescs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const truncate = (text: string, max: number) => {
    if (text.length <= max) return text;
    const trimmed = text.slice(0, max).trimEnd();
    const lastSpace = trimmed.lastIndexOf(" ");
    return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + "…";
  };

  const filteredApps = selectedIndustry
    ? applications.filter((a) => a.industries.includes(selectedIndustry))
    : applications;

  const getRecommendedMaterials = (app: Application) =>
    materials.filter((m) => app.recommendedMaterials.includes(m.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AnimatedSection>
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
            Application Guide
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Select your industry and application for tailored material recommendations from Höganäs.
          </p>
        </div>
      </AnimatedSection>

      {/* Industries */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Select industry
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
            All industries
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
              {ind.name}
            </button>
          ))}
        </div>
      </div>

      {/* Applications grid */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => {
          const isSelected = selectedApp?.id === app.id;
          const recommended = getRecommendedMaterials(app);

          return (
            <StaggerItem key={app.id}>
              <div
                className={`cursor-pointer rounded-xl border p-5 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 hoganas-shadow"
                    : "border-border bg-card hover:border-primary/30 hover:hoganas-shadow"
                }`}
                onClick={() => setSelectedApp(isSelected ? null : app)}
              >
                <div className="mb-3">
                  <h3 className="text-base font-bold text-foreground">{app.name}</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isSelected ? app.description : truncate(app.description, MAX_DESC_LENGTH)}
                  {!isSelected && app.description.length > MAX_DESC_LENGTH && (
                    <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                      Read more
                      <ChevronDown className="h-3 w-3" />
                    </span>
                  )}
                </p>

                {isSelected && recommended.length > 0 && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Recommended materials
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
                            {compareList.some((c) => c.id === m.id) ? "Added" : "+ Compare"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Scenario section */}
      <div className="mt-12 rounded-xl hoganas-gradient p-8 text-center">
        <h3 className="mb-2 text-xl font-bold text-primary-foreground">
          Choose Your Challenge
        </h3>
        <p className="mx-auto mb-6 max-w-lg text-sm text-primary-foreground/80">
          Tell us about your specific electromagnetic design challenge — combine requirements like high frequency + compact size — and our specialists will help you find the optimal Somaloy® solution.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/90"
        >
          Contact a Specialist
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default ApplicationGuide;
