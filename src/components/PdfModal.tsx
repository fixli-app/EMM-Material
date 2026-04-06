import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Loader2, X } from "lucide-react";

interface PdfModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

const PdfModal = ({ url, title, onClose }: PdfModalProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-[85vh] rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Open
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="relative flex-1 bg-muted/30">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Loading document…</p>
            </div>
          )}
          <iframe
            src={url}
            title={title}
            className="h-full w-full border-0"
            allow="fullscreen"
            onLoad={() => setLoading(false)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PdfModal;
