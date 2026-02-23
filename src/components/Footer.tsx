import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <img
            src="/hoganas-logo.svg"
            alt="Höganäs AB"
            className="mb-3 h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            World leader in metal powder technology. Innovating since 1797 — enabling a sustainable future through iron and metal powders.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          <div className="space-y-2">
            {[
              { to: "/", label: "Material Selector" },
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

        {/* Technologies */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Technologies
          </p>
          <div className="space-y-2">
            {[
              { href: "https://www.hoganas.com/en/powder-technologies/pressing-sintering/", label: "Pressing & Sintering" },
              { href: "https://www.hoganas.com/en/powder-technologies/soft-magnetic-composites/", label: "Soft Magnetic Composites" },
              { href: "https://www.hoganas.com/en/powder-technologies/additive-manufacturing/", label: "Additive Manufacturing" },
              { href: "https://www.hoganas.com/en/powder-technologies/brazing/", label: "Brazing" },
              { href: "https://www.hoganas.com/en/powder-technologies/surface-coating/", label: "Surface Coating" },
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
          © {new Date().getFullYear()} Höganäs AB. All rights reserved. This is a material selection tool — contact us for binding specifications.
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
