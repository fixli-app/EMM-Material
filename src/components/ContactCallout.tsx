import { ArrowUpRight } from "lucide-react";

const ContactCallout = () => (
  <div className="mt-8 flex flex-col gap-4 rounded-xl border border-accent/25 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
    <div>
      <h3 className="text-sm font-semibold text-foreground">Haven't found the right match?</h3>
      <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        If none of these materials meets your needs, contact our team. We may still be able to help you find the right solution for your application.
      </p>
    </div>
    <a
      href="https://www.hoganas.com/en/contact/"
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Contact Höganäs
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  </div>
);

export default ContactCallout;
