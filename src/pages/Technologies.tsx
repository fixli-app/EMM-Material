import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CaseShowcase from "@/components/CaseShowcase";
import FloatingOrbs from "@/components/FloatingOrbs";
import { useParallax } from "@/hooks/use-parallax";

import heroSmc from "@/assets/hero-smc.jpg";
import heroPowder from "@/assets/hero-powder.jpg";
import indAutomotive from "@/assets/ind-automotive-new.webp";
import indEnergy from "@/assets/ind-industrial-new.webp";
import caseAxialFlux from "@/assets/case-axial-flux.jpg";
import caseKoenigsegg from "@/assets/case-koenigsegg.jpg";

const caseStudies = [
  {
    image: caseAxialFlux,
    title: "Axial flux machines save space, weight and cost",
    text: "Somaloy®'s 3D magnetic properties and net-shaping capabilities make it the key enabler of compact axial flux motors for hybrid and full-electric drivetrains.",
    href: "https://www.hoganas.com/en/Industries/automotive-transportation/get-inspired/axial-flux-machines-save-space-weight-and-cost/",
    brochure: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_savings-with-somaloy_1679hog.pdf&mode=brochure&title=undefined#page=2",
  },
  {
    image: caseKoenigsegg,
    title: "Powering Koenigsegg's Regera with metal powder",
    text: "The 1,500 hp Regera hypercar uses three YASA axial flux motors containing Somaloy® components — the most powerful electrical motor set-up in production car history.",
    href: "https://www.hoganas.com/en/Industries/automotive-transportation/get-inspired/powering-koenigseggs-regera-car-with-metal-powder/",
    brochure: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_powerful-with-somaloy_1510hog.pdf&mode=brochure&title=undefined#page=1",
  },
];

const Technologies = () => {
  const [casesOpen, setCasesOpen] = useState(false);
  const { ref: heroRef, offset: heroOffset } = useParallax(0.3);
  const [activeBrochure, setActiveBrochure] = useState<typeof caseStudies[0] | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section ref={heroRef as React.RefObject<HTMLElement>} className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ transform: `translateY(${heroOffset}px)` }}>
            <img src={heroSmc} alt="" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,85%,8%)/0.85] via-[hsl(215,80%,12%)/0.6] to-transparent" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
            <AnimatedSection>
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3.5 py-1 backdrop-blur-sm"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-hoganas-glow animate-pulse-glow" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                    Somaloy® Technology
                  </span>
                </motion.div>

                <h1 className="mb-4 text-2xl font-bold leading-[1.15] tracking-tight text-primary-foreground sm:text-3xl lg:text-4xl xl:text-5xl">
                  Soft magnetic composites
                  <br />
                  <span className="text-primary-foreground/70 font-medium">
                    — enabling more efficient electromagnetic designs
                  </span>
                </h1>

                <p className="mb-8 max-w-lg text-sm leading-relaxed text-primary-foreground/55 sm:text-[15px]">
                  Compact, high-performance electromagnetic components through Somaloy® — insulated iron powder enabling 3D magnetic flux paths for motors, inductors and transformers.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/selector"
                    className="group inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-5 py-3 text-xs font-semibold text-foreground transition-all hover:shadow-lg hover:shadow-primary-foreground/20 sm:text-sm sm:px-6"
                  >
                    Explore Somaloy® materials
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 px-5 py-3 text-xs font-medium text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/10 sm:text-sm sm:px-6"
                  >
                    Contact a specialist
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── WHAT IS SMC — editorial intro ── */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <AnimatedSection>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                The technology
              </p>
              <h2 className="mb-6 text-3xl font-bold leading-snug tracking-tight text-foreground sm:text-4xl">
                Three-dimensional magnetic circuit design
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  SMC materials are made of iron powder particles coated with an electrically insulating layer. They can be formed into complex shapes by means of powder metallurgy, thereby allowing three-dimensional magnetic circuit design — something laminated steel cannot achieve.
                </p>
                <p>
                  The insulation on each particle minimises eddy current losses, making Somaloy® materials particularly suited for applications operating at higher frequencies. Combined with the ability to create net-shape 3D components in a single compaction step, SMC delivers both design freedom and production efficiency.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15} direction="right">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroPowder}
                  alt="Somaloy iron powder particles"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── KEY BENEFITS — clean list, no icons ── */}
        <section className="relative border-y border-border">
          <div className="absolute inset-0 hoganas-gradient-subtle" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <AnimatedSection>
              <div className="mb-14 max-w-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Benefits
                </p>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Why soft magnetic composites?
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  The main benefits of Somaloy® SMC solutions for both motor design and production processes.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Compact design",
                  text: "Both size and weight of electromagnetic components can be significantly reduced, enabling smaller and lighter motors and inductors.",
                },
                {
                  title: "High performance",
                  text: "Somaloy® materials can meet the highest efficiency requirements, with low core losses especially at elevated frequencies above 1 kHz.",
                },
                {
                  title: "Cost efficiency",
                  text: "Compact designs require less material. Net-shape production minimises waste and reduces the need for subsequent machining operations.",
                },
                {
                  title: "3D flux capability",
                  text: "Unlike laminated steel, SMC materials carry magnetic flux in all three dimensions — enabling entirely new motor topologies like axial flux machines.",
                },
                {
                  title: "Scalable production",
                  text: "Powder metallurgy enables high-volume manufacturing with excellent repeatability, making SMC suitable for automotive series production.",
                },
                {
                  title: "Sustainable materials",
                  text: "Iron-based and fully recyclable. re-Somaloy® variants deliver identical performance with a reduced CO₂ footprint throughout the value chain.",
                },
              ].map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 0.05}>
                  <div className="h-full bg-card p-8 transition-colors hover:bg-muted/30">
                    <h3 className="mb-3 text-base font-bold text-foreground">{item.title}</h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── APPLICATIONS — two-column with images ── */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <AnimatedSection>
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Applications
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                From electric vehicles to industrial drives
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Somaloy® components are used in a wide range of electromagnetic applications across automotive and industrial sectors.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                image: indAutomotive,
                label: "Automotive",
                items: ["Traction motors", "Air conditioning compressors", "Pumps (cooling, oil)", "DC/DC converters", "On-vehicle chargers"],
              },
              {
                image: indEnergy,
                label: "Industrial",
                items: ["Air conditioning compressors", "Ventilation fans", "Solar power inverters", "Industrial motor drives", "Off-board battery charging"],
              },
            ].map((col, i) => (
              <AnimatedSection key={col.label} delay={i * 0.1}>
                <div className="group overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative overflow-hidden">
                    <img
                      src={col.image}
                      alt={col.label}
                      className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <p className="absolute bottom-4 left-5 text-lg font-bold text-foreground">{col.label}</p>
                  </div>
                  <ul className="p-6 space-y-2.5">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] text-muted-foreground">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2}>
            <div className="mt-8 flex justify-center">
              <Link
                to="/applications"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
              >
                See all applications
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </AnimatedSection>
        </section>

        {/* ── CASE STUDIES — inline preview ── */}
        <section className="relative border-y border-border">
          <div className="absolute inset-0 hoganas-gradient-subtle" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <AnimatedSection>
              <div className="mb-14 max-w-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Get inspired
                </p>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Real-world applications
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid gap-6 md:grid-cols-2">
              {caseStudies.map((c, i) => (
                <AnimatedSection key={c.title} delay={i * 0.1}>
                  <div
                    onClick={() => setActiveBrochure(c)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/15"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-base font-bold text-foreground group-hover:text-accent transition-colors sm:text-lg">
                        {c.title}
                      </h3>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">{c.text}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                          View brochure
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <a
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
                        >
                          Read case study
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <AnimatedSection delay={0.1}>
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="relative overflow-hidden rounded-3xl hoganas-gradient p-12 text-center sm:p-20">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[hsl(195,85%,50%)/0.15] blur-[80px]" />
              <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[hsl(215,80%,40%)/0.2] blur-[60px]" />

              <div className="relative">
                <h3 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
                  Find the right Somaloy® grade for your application
                </h3>
                <p className="mx-auto mb-10 max-w-xl text-[15px] text-primary-foreground/60">
                  Höganäs offers design services in combination with a wide range of soft magnetic composite materials with unique 3D flux properties, ideal for new motor designs.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/selector"
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:shadow-lg hover:shadow-primary-foreground/20"
                  >
                    Material Selector
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/25 px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10"
                  >
                    Contact a specialist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      {/* Brochure Modal */}
      {activeBrochure && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveBrochure(null)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[85vh] rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden flex flex-col"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
                  {activeBrochure.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeBrochure.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Case study
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => setActiveBrochure(null)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="flex-1 bg-muted/30">
              <iframe
                src={activeBrochure.brochure}
                title={activeBrochure.title}
                className="h-full w-full border-0"
                allow="fullscreen"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
      <CaseShowcase open={casesOpen} onOpenChange={setCasesOpen} />
      <Footer />
    </div>
  );
};

export default Technologies;
