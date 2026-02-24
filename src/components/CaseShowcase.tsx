import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import caseAxialFlux from "@/assets/case-axial-flux.jpg";
import caseKoenigsegg from "@/assets/case-koenigsegg.jpg";

const cases = [
  {
    id: "axial-flux",
    image: caseAxialFlux,
    badge: "Automotive · Electrification",
    title: "Axial flux machines save space, weight and cost",
    summary:
      "Somaloy®'s 3D magnetic properties and net-shaping capabilities make it the key enabler of compact axial flux motors — delivering high power density for hybrid and full-electric drivetrains at scale.",
    highlights: [
      "High power & torque density at standard RPM",
      "Net-shaped 3D Somaloy® components",
      "Cost-efficient large-volume PM production",
    ],
    href: "https://www.hoganas.com/en/Industries/automotive-transportation/get-inspired/axial-flux-machines-save-space-weight-and-cost/",
  },
  {
    id: "koenigsegg",
    image: caseKoenigsegg,
    badge: "Automotive · Hypercar",
    title: "Powering Koenigsegg's 'Regera' with Somaloy®",
    summary:
      "The 1,500 hp Regera hypercar uses three YASA axial flux motors containing Somaloy® components — the most powerful electrical motor set-up in production car history, replacing a traditional gearbox while saving weight.",
    highlights: [
      "0–400 km/h in under 20 seconds",
      "Three compact YASA axial flux motors",
      "Somaloy® enables high durability & low losses",
    ],
    href: "https://www.hoganas.com/en/Industries/automotive-transportation/get-inspired/powering-koenigseggs-regera-car-with-metal-powder/",
  },
];

interface CaseShowcaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CaseShowcase = ({ open, onOpenChange }: CaseShowcaseProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Somaloy® Case Studies
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Real-world applications of soft magnetic composite technology
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {cases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="aspect-[16/8] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-wider">
                  {c.badge}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 text-base font-bold leading-snug text-foreground sm:text-lg">
                  {c.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {c.summary}
                </p>

                {/* Highlights */}
                <ul className="mb-4 space-y-1.5">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground sm:text-sm">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>

                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Read full case
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseShowcase;
