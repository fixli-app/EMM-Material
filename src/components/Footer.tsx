import { Link } from "react-router-dom";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import hoganasLogo from "@/assets/hoganas-logo-full.png";

const Footer = () => (
  <footer className="relative border-t border-border bg-card">
    {/* Top accent line */}
    <div className="absolute inset-x-0 top-0 h-px hoganas-gradient-warm opacity-30" />

    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:pr-8">
          <img
            src={hoganasLogo}
            alt="Höganäs AB"
            className="mb-4 h-7"
          />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Somaloy® Soft Magnetic Composites — enabling 3D magnetic flux for electric motors, inductors and transformers.
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground/60">
            Innovating the electric era since 1797.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
            Navigation
          </p>
          <div className="space-y-2.5">
            {[
              { to: "/", label: "Somaloy® SMC" },
              { to: "/selector", label: "Material Selector" },
              { to: "/applications", label: "Application Guide" },
              { to: "/compare", label: "Compare Materials" },
              { to: "/contact", label: "Contact & Quote" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Somaloy Resources */}
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
            Somaloy® Resources
          </p>
          <div className="space-y-2.5">
            {[
              { href: "https://www.hoganas.com/en/powder-technologies/soft-magnetic-composites/", label: "SMC Technology" },
              { href: "https://www.hoganas.com/en/Industries/automotive-transportation/get-inspired/axial-flux-machines-save-space-weight-and-cost/", label: "Axial Flux Case Study" },
              { href: "https://www.hoganas.com/en/Industries/automotive-transportation/get-inspired/powering-koenigseggs-regera-car-with-metal-powder/", label: "Koenigsegg Case Study" },
              { href: "https://www.hoganas.com/en/Sustainability/", label: "Sustainability" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
            Contact
          </p>
          <div className="space-y-2 text-[13px] text-muted-foreground">
            <p className="font-medium text-foreground">Höganäs AB</p>
            <p>SE-263 83 Höganäs, Sweden</p>
            <a href="tel:+4642338000" className="block transition-colors hover:text-foreground">+46 42 33 80 00</a>
            <a href="mailto:info@hoganas.com" className="block transition-colors hover:text-foreground">info@hoganas.com</a>
            <a
              href="https://www.hoganas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-primary/10"
            >
              hoganas.com
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
        <p className="text-[11px] text-muted-foreground/70">
          © {new Date().getFullYear()} Höganäs AB. All rights reserved. Somaloy® is a registered trademark.
        </p>
        <div className="flex gap-6">
          <a href="https://www.hoganas.com/en/Sustainability/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted-foreground/70 transition-colors hover:text-foreground">
            Sustainability
          </a>
          <a href="https://www.hoganas.com/en/about-hoganas/hoganas-in-three-minutes/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted-foreground/70 transition-colors hover:text-foreground">
            About Höganäs
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
