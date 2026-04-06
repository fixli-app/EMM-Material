import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex flex-1 items-center justify-center px-4">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl hoganas-gradient">
          <span className="text-3xl font-bold text-primary-foreground">404</span>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for doesn't exist or has been moved. Use the navigation below to find what you need.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Somaloy® SMC
          </Link>
          <Link
            to="/selector"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Material Selector
          </Link>
        </div>
      </motion.div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
