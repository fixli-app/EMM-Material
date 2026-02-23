import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import techPressSinter from "@/assets/tech-pressing-sintering.jpg";
import techSoftMag from "@/assets/tech-soft-magnetics.jpg";
import techAM from "@/assets/tech-additive-manufacturing.jpg";
import techCoating from "@/assets/tech-surface-coating.jpg";
import techBrazing from "@/assets/tech-brazing.jpg";
import techFriction from "@/assets/tech-friction.jpg";
import techMIM from "@/assets/tech-mim.jpg";

const technologies = [
  {
    id: "pressing-sintering",
    name: "Pressing & Sintering",
    subtitle: "The foundation of powder metallurgy",
    description:
      "Metal powders are compacted under high pressure and sintered at elevated temperatures to create near-net-shape components with excellent dimensional precision. This process enables mass production of complex geometries that would be difficult or impossible to achieve with conventional machining.",
    image: techPressSinter,
    brands: ["Astaloy®", "Distaloy®", "Iron Powders"],
    capabilities: [
      "Production volumes from 1,000 to millions of parts",
      "Tolerances as tight as ±0.05 mm",
      "Densities from 6.4 to 7.5 g/cm³",
      "Sinter-hardening for combined sintering and heat treatment",
    ],
    href: "https://www.hoganas.com/en/powder-technologies/pressing-sintering/",
  },
  {
    id: "soft-magnetics",
    name: "Soft Magnetic Composites",
    subtitle: "3D magnetic flux for the electric era",
    description:
      "Somaloy® technology uses insulated iron powder particles to create components with unique 3D magnetic flux paths. Unlike laminated steel, SMC enables isotropic magnetic properties — critical for axial flux motors, inductors and compact electromagnetic devices.",
    image: techSoftMag,
    brands: ["Somaloy® 700", "Somaloy® 500", "Somaloy® 130i", "Somaloy® 110i"],
    capabilities: [
      "Permeability range: 380–900",
      "Core loss as low as 32 W/kg at 1T/400Hz",
      "Saturation induction up to 1.7 T",
      "Unique 3D flux capability vs. laminations",
    ],
    href: "https://www.hoganas.com/en/powder-technologies/soft-magnetic-composites/",
  },
  {
    id: "additive-manufacturing",
    name: "Additive Manufacturing",
    subtitle: "Design freedom without compromise",
    description:
      "Gas-atomized metal powders optimized for laser powder bed fusion (PBF), electron beam melting (EBM), and binder jetting. Our AM portfolio spans stainless steels, nickel alloys, tool steels, titanium, copper and cobalt-chrome — each grade tailored for processability and end-part performance.",
    image: techAM,
    brands: ["AM 316L", "AM 17-4PH", "AM Ti-6Al-4V", "AM Inconel 625/718"],
    capabilities: [
      "Spherical morphology for optimal flowability",
      "Particle sizes from 15 to 63 µm (PBF) and 45–150 µm (EBM)",
      "Full density achievable (>99.5%)",
      "Wide alloy portfolio including reactive metals",
    ],
    href: "https://www.hoganas.com/en/powder-technologies/additive-manufacturing/",
  },
  {
    id: "surface-coating",
    name: "Surface Coating",
    subtitle: "Extreme wear and corrosion protection",
    description:
      "Thermal spray and laser cladding powders engineered for the most demanding environments — from mining equipment to offshore oil & gas. Our Rockit® and Amperit® ranges deliver hardness up to 65 HRC and corrosion resistance that outperforms solid alloys at a fraction of the cost.",
    image: techCoating,
    brands: ["Rockit®", "Amperit®", "Surfit®", "FeCrAl"],
    capabilities: [
      "HVOF, plasma spray, laser cladding and cold spray",
      "Hardness up to 65 HRC",
      "Cobalt-free and nickel-free alternatives available",
      "Sustainable hardfacing replacing chrome plating",
    ],
    href: "https://www.hoganas.com/en/powder-technologies/surface-coating/",
  },
  {
    id: "brazing",
    name: "Brazing",
    subtitle: "Strong, clean joints at scale",
    description:
      "BrazeLet® powders and pastes for vacuum and controlled-atmosphere brazing of heat exchangers, EGR coolers, fuel cells and stainless steel assemblies. Nickel-based and copper-based filler metals engineered for optimal flow, wetting and joint strength.",
    image: techBrazing,
    brands: ["BrazeLet®", "BrazeLet® Ni", "BrazeLet® F300"],
    capabilities: [
      "Brazing temperatures from 600°C to 1200°C",
      "Joint strength exceeding base metal in many cases",
      "Copper-free options for clean applications",
      "Paste formulations for automated dispensing",
    ],
    href: "https://www.hoganas.com/en/powder-technologies/brazing/",
  },
  {
    id: "friction",
    name: "Friction Materials",
    subtitle: "Controlled friction under extreme conditions",
    description:
      "Sintered friction materials for high-performance brakes, clutches and transmission systems. Iron- and copper-based formulations deliver consistent friction coefficients across wide temperature ranges — engineered for heavy-duty vehicles, wind turbines and industrial machinery.",
    image: techFriction,
    brands: ["Iron-based", "Copper-based"],
    capabilities: [
      "Operating temperatures exceeding 600°C",
      "Consistent friction coefficient across load range",
      "Designed for wet and dry applications",
      "Long service life in heavy-duty conditions",
    ],
    href: "https://www.hoganas.com/en/powder-technologies/friction/",
  },
  {
    id: "metal-injection-molding",
    name: "Metal Injection Molding (MIM)",
    subtitle: "Complexity meets volume",
    description:
      "Ultra-fine metal powders mixed with binders and injection molded into complex shapes, then debound and sintered to near-full density. MIM combines the design freedom of plastic injection molding with the strength and durability of metals — ideal for high-volume production of small, intricate parts.",
    image: techMIM,
    brands: ["MIM 4605", "MIM 316L", "MIM 17-4PH", "MIM 420"],
    capabilities: [
      "Part weights from 0.1 g to 250 g",
      "Wall thickness as thin as 0.3 mm",
      "Sintered density >96% of theoretical",
      "Tolerances ±0.3% of nominal dimension",
    ],
    href: "https://www.hoganas.com/en/powder-technologies/metal-injection-moulding/",
  },
];

const Technologies = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1">
      {/* Hero */}
      <section className="hoganas-gradient py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AnimatedSection>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Powder Technologies
            </p>
            <h1 className="mb-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
              Seven technology platforms, one global leader
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
              From conventional pressing &amp; sintering to additive manufacturing and soft magnetic composites — Höganäs provides the complete metal powder portfolio for every industrial challenge.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Technology sections */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="space-y-20 sm:space-y-28">
          {technologies.map((tech, i) => {
            const isReversed = i % 2 === 1;
            return (
              <AnimatedSection key={tech.id} delay={0.1}>
                <div className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14 ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <motion.div
                    className="lg:w-1/2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={tech.image}
                        alt={tech.name}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="lg:w-1/2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                      {tech.subtitle}
                    </p>
                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {tech.name}
                    </h2>
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {tech.description}
                    </p>

                    {/* Brands */}
                    <div className="mb-5 flex flex-wrap gap-2">
                      {tech.brands.map((b) => (
                        <Badge key={b} variant="secondary" className="text-xs">
                          {b}
                        </Badge>
                      ))}
                    </div>

                    {/* Capabilities */}
                    <ul className="mb-6 space-y-2">
                      {tech.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {cap}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/?tech=${tech.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Find materials
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={tech.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Learn more
                        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.2}>
          <div className="mt-20 rounded-2xl hoganas-gradient p-10 text-center sm:mt-28 sm:p-16">
            <h3 className="mb-3 text-2xl font-bold text-primary-foreground sm:text-3xl">
              Not sure which technology fits?
            </h3>
            <p className="mx-auto mb-8 max-w-lg text-sm text-primary-foreground/75 sm:text-base">
              Our material specialists help you navigate the full portfolio. Describe your application — we recommend the optimal powder solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/"
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
        </AnimatedSection>
      </div>
    </main>
    <Footer />
  </div>
);

export default Technologies;
