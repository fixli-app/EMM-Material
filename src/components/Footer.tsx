import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import hoganasLogo from "@/assets/hoganas-logo-full.png";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <img
            src={hoganasLogo}
            alt="Höganäs AB"
            className="mb-3 h-6"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Somaloy® Soft Magnetic Composites — enabling 3D magnetic flux for electric motors, inductors and transformers. Innovating the electric era since 1797.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          <div className="space-y-2">
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
                className="block text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Somaloy Resources */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Somaloy® Resources
          </p>
          <div className="space-y-2">
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
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>Höganäs AB</p>
            <p>SE-263 83 Höganäs, Sweden</p>
            <a href="tel:+4642338000" className="block hover:text-foreground">+46 42 33 80 00</a>
            <a href="mailto:info@hoganas.com" className="block hover:text-foreground">info@hoganas.com</a>
            <a
              href="https://www.hoganas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 font-medium text-accent hover:underline"
            >
              hoganas.com
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
        <p className="text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Höganäs AB. All rights reserved. Somaloy® is a registered trademark. This is a material selection tool — contact us for binding specifications.
        </p>
        <div className="flex gap-4">
          <a href="https://www.hoganas.com/en/Sustainability/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-foreground">
            Sustainability
          </a>
          <a href="https://www.hoganas.com/en/about-hoganas/hoganas-in-three-minutes/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-foreground">
            About Höganäs
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
