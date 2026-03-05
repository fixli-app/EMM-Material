import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lightbulb, Zap, Cpu, Wind, Battery, Settings, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CaseShowcase from "@/components/CaseShowcase";
import FloatingOrbs from "@/components/FloatingOrbs";
import { useParallax } from "@/hooks/use-parallax";

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
            <img src={techSoftMag} alt="" className="h-full w-full object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,85%,8%)/0.95] via-[hsl(215,80%,14%)/0.88] to-[hsl(195,85%,25%)/0.6]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(215,85%,8%)/0.3] to-transparent" />
          </div>

          {/* Floating orbs */}
          <FloatingOrbs />

          {/* Static decorative elements */}
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[hsl(195,85%,38%)/0.06] blur-[120px]" />
          <div className="absolute -left-32 bottom-0 h-[300px] w-[300px] rounded-full bg-[hsl(215,80%,22%)/0.1] blur-[80px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-36 lg:py-44">
            <AnimatedSection>
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-1.5 backdrop-blur-sm"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-hoganas-glow animate-pulse-glow" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                    Somaloy® Technology
                  </span>
                </motion.div>

                <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                  3D magnetic flux
                  <br />
                  <span className="bg-gradient-to-r from-primary-foreground via-primary-foreground/90 to-[hsl(195,85%,65%)] bg-clip-text text-transparent">
                    for the electric era
                  </span>
                </h1>

                <p className="mb-10 max-w-xl text-[15px] leading-relaxed text-primary-foreground/65 sm:text-base">
                  Soft Magnetic Composites from Höganäs — insulated iron powder particles enabling unique 3D flux paths for electric motors, inductors, transformers and sensors.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/selector"
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:shadow-lg hover:shadow-primary-foreground/20"
                  >
                    Find your Somaloy® grade
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <button
                    onClick={() => setCasesOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 px-6 py-3.5 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
                  >
                    <Lightbulb className="h-4 w-4" />
                    View case studies
                  </button>
                </div>

                <div className="mt-14 flex items-center gap-10">
                  {[
                    { value: "14", label: "SMC grades" },
                    { value: "1.7 T", label: "Max Bsat" },
                    { value: "32 W/kg", label: "Core loss (1T/400Hz)" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <p className="text-3xl font-bold text-primary-foreground">{stat.value}</p>
                      <p className="text-[11px] text-primary-foreground/45 mt-0.5">{stat.label}</p>
                      {i < 2 && <div className="absolute -right-5 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-primary-foreground/15 sm:block" />}
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Key advantages */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <AnimatedSection>
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Why Somaloy®?
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The SMC advantage
              </h2>
              <p className="mx-auto max-w-lg text-[15px] text-muted-foreground">
                Somaloy® soft magnetic composites unlock design possibilities that laminated steel cannot achieve.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {keyAdvantages.map((adv) => (
              <StaggerItem key={adv.title}>
                <motion.div
                  className="group relative rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/15"
                  whileHover={{ y: -4 }}
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/12">
                    <adv.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mb-2 text-[15px] font-bold text-foreground">{adv.title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{adv.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Product range overview */}
        <section className="relative border-y border-border">
          <div className="absolute inset-0 hoganas-gradient-subtle" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <AnimatedSection>
              <div className="mb-14 text-center">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Product Portfolio
                </p>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  The Somaloy® range
                </h2>
                <p className="mx-auto max-w-xl text-[15px] text-muted-foreground">
                  Four powder series with three treatment levels (1P, 3P, 5P) — each optimized for specific frequency ranges and performance requirements.
                </p>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {somaloyGrades.map((series) => (
                <StaggerItem key={series.series}>
                  <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/15">
                    <h3 className="mb-1.5 text-lg font-bold text-foreground">{series.series}</h3>
                    <p className="mb-4 text-[12px] text-muted-foreground">{series.mesh} · {series.focus}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {series.grades.map((g) => (
                        <Badge key={g} variant="secondary" className="text-[10px] font-medium">{g}</Badge>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Treatment levels */}
            <AnimatedSection delay={0.2}>
              <div className="mt-12 rounded-2xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-muted/40 px-6 py-4">
                  <h3 className="text-sm font-bold text-foreground">Treatment levels explained</h3>
                </div>
                <div className="grid gap-0 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                  {[
                    {
                      level: "5P",
                      desc: "Lowest core losses. Inert atmosphere (N₂) heat treatment at max 650°C. Best electromagnetic performance.",
                      color: "bg-accent text-accent-foreground",
                    },
                    {
                      level: "3P",
                      desc: "Highest mechanical strength (TRS). Steam treatment at max 530°C. Best for structural integrity.",
                      color: "bg-primary text-primary-foreground",
                    },
                    {
                      level: "1P",
                      desc: "Most economical. Air atmosphere at max 530°C. Good baseline performance for cost-sensitive applications.",
                      color: "bg-muted-foreground/80 text-primary-foreground",
                    },
                  ].map((t) => (
                    <div key={t.level} className="p-6">
                      <Badge className={`mb-3 ${t.color} text-[10px] font-bold`}>{t.level}</Badge>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Specifications table */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Technical Specifications
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Key performance data
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-5 py-4 text-left font-bold text-foreground">Property</th>
                    <th className="px-5 py-4 text-center font-bold text-foreground">Somaloy 700</th>
                    <th className="px-5 py-4 text-center font-bold text-foreground">Somaloy 500</th>
                    <th className="px-5 py-4 text-center font-bold text-foreground">Somaloy 130i</th>
                    <th className="px-5 py-4 text-center font-bold text-foreground">Somaloy 110i</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { prop: "Permeability (μmax)", vals: ["430–600", "360–450", "550–700", "~900"] },
                    { prop: "Bsat (T)", vals: ["1.5–1.6", "1.35–1.45", "1.65–1.7", "~1.45"] },
                    { prop: "Core loss 1T/400Hz (W/kg)", vals: ["32–55", "—", "38–60", "—"] },
                    { prop: "Core loss 1T/1kHz (W/kg)", vals: ["105–170", "70–140", "~130", "~85"] },
                    { prop: "Resistivity (μΩm)", vals: ["50–200", "120–800", "~150", "~500"] },
                    { prop: "TRS (MPa)", vals: ["50–100", "45–80", "45–60", "~45"] },
                    { prop: "Typical density (g/cm³)", vals: ["7.35–7.55", "7.10–7.35", "7.50–7.65", "7.30–7.50"] },
                  ].map((row, i) => (
                    <tr key={row.prop} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                      <td className="px-5 py-3 font-medium text-foreground">{row.prop}</td>
                      {row.vals.map((v, j) => (
                        <td key={j} className="px-5 py-3 text-center text-muted-foreground">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </section>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.2}>
          <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28">
            <div className="relative overflow-hidden rounded-3xl hoganas-gradient p-12 text-center sm:p-20">
              {/* Decorative orbs */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[hsl(195,85%,50%)/0.15] blur-[80px]" />
              <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[hsl(215,80%,40%)/0.2] blur-[60px]" />

              <div className="relative">
                <h3 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
                  Find the right Somaloy® grade
                </h3>
                <p className="mx-auto mb-10 max-w-lg text-[15px] text-primary-foreground/65">
                  Use our material selector to compare SMC grades based on your specific application requirements — from EV traction motors to high-frequency inductors.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/selector"
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:shadow-lg hover:shadow-primary-foreground/20"
                  >
                    Start Material Selector
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/25 px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10"
                  >
                    Contact a Specialist
                  </Link>
                </div>
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
