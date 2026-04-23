import { useState } from "react";
import { type Material } from "@/data/materials";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Send, FileText, Download, Phone, Mail, MapPin, X, Globe, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import countriesData from "world-countries";
import { cn } from "@/lib/utils";

const COUNTRIES = countriesData
  .map((c) => ({ name: c.name.common, flag: c.flag, code: c.cca2 }))
  .sort((a, b) => a.name.localeCompare(b.name));

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
  const [countryOpen, setCountryOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!form.country) {
      toast({ title: "Please select your country", variant: "destructive" });
      return;
    }
    toast({
      title: "Thank you for your inquiry!",
      description: "Our sales team will get back to you within 24 hours.",
    });
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      country: "",
      application: "",
      message: "",
      requestType: "quote",
      
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AnimatedSection>
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Request a quote, Somaloy® samples or expert advice on SMC material selection. Our team will help you find
            the optimal grade.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <AnimatedSection delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-border bg-card p-6 hoganas-shadow"
          >
            {/* Request type */}
            <div>
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Request Type
              </Label>
              <div className="flex gap-2">
                {(
                  [
                    ["quote", "Quote"],
                    ["sample", "Samples"],
                    ["advice", "Advisory"],
                  ] as const
                ).map(([type, label]) => (
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
                  Selected Materials
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
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+46..."
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <span className="flex items-center gap-2 truncate">
                        {form.country ? (
                          <>
                            <span className="text-base leading-none">
                              {COUNTRIES.find((c) => c.name === form.country)?.flag}
                            </span>
                            <span className="truncate">{form.country}</span>
                          </>
                        ) : (
                          <>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Select country</span>
                          </>
                        )}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search country..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {COUNTRIES.map((c) => (
                            <CommandItem
                              key={c.code}
                              value={c.name}
                              onSelect={() => {
                                setForm((f) => ({ ...f, country: c.name }));
                                setCountryOpen(false);
                              }}
                            >
                              <span className="mr-2 text-base leading-none">{c.flag}</span>
                              <span className="flex-1">{c.name}</span>
                              <Check
                                className={cn(
                                  "ml-2 h-4 w-4",
                                  form.country === c.name ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="application">Application</Label>
                <Input
                  id="application"
                  value={form.application}
                  onChange={(e) => setForm((f) => ({ ...f, application: e.target.value }))}
                  placeholder="e.g. sintered gears"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Describe your needs, volumes, timeline..."
                rows={4}
              />
            </div>

            {/* Sales region */}
            <div>
              <Label htmlFor="region" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sales Region *
              </Label>
              <Select
                value={form.region}
                onValueChange={(v) => setForm((f) => ({ ...f, region: v as typeof f.region }))}
              >
                <SelectTrigger id="region" className="h-11 w-full">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select your sales region" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex flex-col py-0.5">
                        <span className="text-sm font-semibold">{r.label}</span>
                        <span className="text-[11px] text-muted-foreground">{r.desc}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Routes your inquiry to the right Höganäs sales team.
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              Submit Inquiry
            </button>
          </form>
        </AnimatedSection>

        {/* Sidebar */}
        <AnimatedSection delay={0.2}>
          <div className="space-y-6">
            {/* Contact info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-bold text-foreground">Höganäs AB</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Höganäs AB
                    <br />
                    SE-263 83 Höganäs
                    <br />
                    Sweden
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href="tel:+4642338000" className="text-xs text-accent hover:underline">
                    +46 42 33 80 00
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href="mailto:info@hoganas.com" className="text-xs text-accent hover:underline">
                    info@hoganas.com
                  </a>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-bold text-foreground">Resources</h3>
              <div className="space-y-2">
                <a
                  href="https://www.hoganas.com/en/powder-technologies/technical-papers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <FileText className="h-4 w-4 text-accent" />
                  Technical Papers
                </a>
                <a
                  href="https://www.hoganas.com/en/powder-technologies/soft-magnetic-composites/products/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Download className="h-4 w-4 text-accent" />
                  Product Catalogue
                </a>
              </div>
            </div>

            {/* Quick guide */}
            <div className="rounded-xl bg-secondary/30 p-6">
              <h3 className="mb-3 text-sm font-bold text-foreground">Next Steps</h3>
              <ol className="space-y-2">
                {[
                  "Select materials in our selector",
                  "Compare your top candidates",
                  "Submit a quote request",
                  "Receive samples and technical support",
                  "Start production",
                ].map((step, i) => (
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
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ContactForm;
