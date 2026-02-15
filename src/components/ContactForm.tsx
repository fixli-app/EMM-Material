import { useState } from "react";
import { type Material } from "@/data/materials";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, FileText, Download, Phone, Mail, MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  selectedMaterials: Material[];
  onRemoveMaterial: (id: string) => void;
}

const ContactForm = ({ selectedMaterials, onRemoveMaterial }: ContactFormProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    application: "",
    message: "",
    requestType: "quote" as "quote" | "sample" | "advice",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast({ title: "Fyll i alla obligatoriska fält", variant: "destructive" });
      return;
    }
    toast({
      title: "Tack för din förfrågan!",
      description: "Vårt säljteam återkommer inom 24 timmar.",
    });
    setForm({ name: "", company: "", email: "", phone: "", country: "", application: "", message: "", requestType: "quote" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Kontakta oss
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          Begär offert, prover eller expertråd. Vårt team hjälper dig hitta den optimala lösningen.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 hoganas-shadow">
          {/* Request type */}
          <div>
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Typ av förfrågan
            </Label>
            <div className="flex gap-2">
              {([["quote", "📋 Offert"], ["sample", "📦 Prover"], ["advice", "💡 Rådgivning"]] as const).map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, requestType: type }))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    form.requestType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected materials */}
          {selectedMaterials.length > 0 && (
            <div>
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Valda material
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedMaterials.map((m) => (
                  <Badge key={m.id} variant="secondary" className="flex items-center gap-1 py-1">
                    {m.name}
                    <button onClick={() => onRemoveMaterial(m.id)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Namn *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ditt namn" />
            </div>
            <div>
              <Label htmlFor="company">Företag *</Label>
              <Input id="company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Företagsnamn" />
            </div>
            <div>
              <Label htmlFor="email">E-post *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="din@email.com" />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+46..." />
            </div>
            <div>
              <Label htmlFor="country">Land</Label>
              <Input id="country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="Sverige" />
            </div>
            <div>
              <Label htmlFor="application">Applikation</Label>
              <Input id="application" value={form.application} onChange={(e) => setForm((f) => ({ ...f, application: e.target.value }))} placeholder="T.ex. sintered gears" />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Meddelande</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Beskriv ditt behov, volymer, tidsram..."
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            Skicka förfrågan
          </button>
        </form>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-bold text-foreground">Höganäs AB</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Höganäs AB<br />
                  SE-263 83 Höganäs<br />
                  Sweden
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+4642338000" className="text-xs text-accent hover:underline">+46 42 33 80 00</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:info@hoganas.com" className="text-xs text-accent hover:underline">info@hoganas.com</a>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-bold text-foreground">Resurser</h3>
            <div className="space-y-2">
              <a
                href="https://www.hoganas.com/en/powder-technologies/technical-papers/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <FileText className="h-4 w-4 text-accent" />
                Tekniska rapporter
              </a>
              <a
                href="https://www.hoganas.com/en/powder-technologies/pressing-sintering/products/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Download className="h-4 w-4 text-accent" />
                Produktkatalog
              </a>
            </div>
          </div>

          {/* Quick guide */}
          <div className="rounded-xl bg-secondary/30 p-6">
            <h3 className="mb-3 text-sm font-bold text-foreground">Nästa steg</h3>
            <ol className="space-y-2">
              {["Välj material i vår materialväljare", "Jämför dina favoritkandidater", "Skicka en offertförfrågan", "Få prover och teknisk support", "Starta produktion"].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
