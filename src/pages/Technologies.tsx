import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lightbulb, Zap, Cpu, Wind, Battery, Settings, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CaseShowcase from "@/components/CaseShowcase";

import techSoftMag from "@/assets/tech-soft-magnetics.jpg";

const keyAdvantages = [
  {
    icon: Zap,
    title: "3D Magnetic Flux",
    description: "Unlike laminated steel, Somaloy® enables isotropic magnetic properties — allowing flux paths in all three dimensions for revolutionary motor designs.",
  },
  {
    icon: Cpu,
    title: "Net-shape Manufacturing",
    description: "Complex 3D geometries produced in a single compaction step. Eliminates stacking, bonding and machining of laminations.",
  },
  {
    icon: Wind,
    title: "Low Core Losses",
    description: "Insulated iron powder particles minimize eddy current losses, especially at high frequencies (>1 kHz) — critical for power electronics and fast-switching motors.",
  },
  {
    icon: Battery,
    title: "Compact & Lightweight",
    description: "Higher power density enables smaller, lighter motor and inductor designs — key for electrification in automotive and aerospace.",
  },
  {
    icon: Settings,
    title: "Scalable Production",
    description: "Powder metallurgy process enables high-volume production with excellent repeatability and minimal material waste.",
  },
  {
    icon: Leaf,
    title: "Sustainable Choice",
    description: "re- Somaloy variants offer identical performance with reduced CO₂ footprint. Fully recyclable iron-based material.",
  },
];

const somaloyGrades = [
  { series: "Somaloy 700", mesh: "-40 mesh", focus: "High Bsat, motors", grades: ["700 5P", "700 3P", "700 1P"] },
  { series: "Somaloy 500", mesh: "-100 mesh", focus: "High frequency, inductors", grades: ["500 5P", "500 3P", "500 1P"] },
  { series: "Somaloy 130i", mesh: "-40 mesh", focus: "Highest Bsat, EV traction", grades: ["130i 5P", "130i 1P"] },
  { series: "Somaloy 110i", mesh: "-100 mesh", focus: "Inductors, EMI filters", grades: ["110i 5P"] },
];

const Technologies = () => {
  const [casesOpen, setCasesOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={techSoftMag} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(210,90%,10%)/0.92] via-[hsl(210,85%,15%)/0.85] to-[hsl(210,85%,25%)/0.65]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32">
            <AnimatedSection>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
                Somaloy® Technology
              </p>
              <h1 className="mb-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                3D magnetic flux for the electric era
              </h1>
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
                Soft Magnetic Composites from Höganäs — insulated iron powder particles enabling unique 3D flux paths for electric motors, inductors, transformers and sensors. The key enabler for compact, efficient electromagnetic designs.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/selector"
                  className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/90"
                >
                  Find your Somaloy® grade
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setCasesOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  <Lightbulb className="h-4 w-4" />
                  View case studies
                </button>
              </div>
              <div className="mt-10 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">14</p>
                  <p className="text-[11px] text-primary-foreground/60">SMC grades</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/20" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">1.7 T</p>
                  <p className="text-[11px] text-primary-foreground/60">Max Bsat</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/20" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">32 W/kg</p>
                  <p className="text-[11px] text-primary-foreground/60">Core loss (1T/400Hz)</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Key advantages */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Why Somaloy®?
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                The SMC advantage
              </h2>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
                Somaloy® soft magnetic composites unlock design possibilities that laminated steel cannot achieve.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keyAdvantages.map((adv, i) => (
              <AnimatedSection key={adv.title} delay={i * 0.05}>
                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
                  whileHover={{ y: -2 }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <adv.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-foreground">{adv.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{adv.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Product range overview */}
        <section className="border-y border-border bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
            <AnimatedSection>
              <div className="mb-12 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  Product Portfolio
                </p>
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  The Somaloy® range
                </h2>
                <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
                  Four powder series with three treatment levels (1P, 3P, 5P) — each optimized for specific frequency ranges and performance requirements.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {somaloyGrades.map((series, i) => (
                <AnimatedSection key={series.series} delay={i * 0.05}>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="mb-1 text-base font-bold text-foreground">{series.series}</h3>
                    <p className="mb-3 text-[11px] text-muted-foreground">{series.mesh} · {series.focus}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {series.grades.map((g) => (
                        <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Treatment levels explanation */}
            <AnimatedSection delay={0.2}>
              <div className="mt-10 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-bold text-foreground">Treatment levels explained</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Badge className="mb-2 bg-primary text-primary-foreground text-[10px]">5P</Badge>
                    <p className="text-xs text-muted-foreground">
                      Lowest core losses. Inert atmosphere (N₂) heat treatment at max 650°C. Best electromagnetic performance.
                    </p>
                  </div>
                  <div>
                    <Badge className="mb-2 bg-primary text-primary-foreground text-[10px]">3P</Badge>
                    <p className="text-xs text-muted-foreground">
                      Highest mechanical strength (TRS). Steam treatment at max 530°C. Best for structural integrity.
                    </p>
                  </div>
                  <div>
                    <Badge className="mb-2 bg-primary text-primary-foreground text-[10px]">1P</Badge>
                    <p className="text-xs text-muted-foreground">
                      Most economical. Air atmosphere at max 530°C. Good baseline performance for cost-sensitive applications.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Specifications table */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Technical Specifications
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Key performance data
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Property</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Somaloy 700</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Somaloy 500</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Somaloy 130i</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Somaloy 110i</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Permeability (μmax)</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">430–600</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">360–450</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">550–700</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">~900</td>
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-4 py-2.5 font-medium text-foreground">Bsat (T)</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">1.5–1.6</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">1.35–1.45</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">1.65–1.7</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">~1.45</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Core loss 1T/400Hz (W/kg)</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">32–55</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">—</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">38–60</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">—</td>
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-4 py-2.5 font-medium text-foreground">Core loss 1T/1kHz (W/kg)</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">105–170</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">70–140</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">~130</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">~85</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Resistivity (μΩm)</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">50–200</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">120–800</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">~150</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">~500</td>
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-4 py-2.5 font-medium text-foreground">TRS (MPa)</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">50–100</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">45–80</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">45–60</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">~45</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Typical density (g/cm³)</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">7.35–7.55</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">7.10–7.35</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">7.50–7.65</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">7.30–7.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </section>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.2}>
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
            <div className="rounded-2xl hoganas-gradient p-10 text-center sm:p-16">
              <h3 className="mb-3 text-2xl font-bold text-primary-foreground sm:text-3xl">
                Find the right Somaloy® grade
              </h3>
              <p className="mx-auto mb-8 max-w-lg text-sm text-primary-foreground/75 sm:text-base">
                Use our material selector to compare SMC grades based on your specific application requirements — from EV traction motors to high-frequency inductors.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/selector"
                  className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/90"
                >
                  Start Material Selector
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  Contact a Specialist
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>
      <CaseShowcase open={casesOpen} onOpenChange={setCasesOpen} />
      <Footer />
    </div>
  );
};

export default Technologies;
