import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Material Selector" },
    { path: "/applications", label: "Applications" },
    { path: "/compare", label: "Compare" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/hoganas-logo.svg"
            alt="Höganäs AB"
            className="h-8"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="hidden items-center gap-2" style={{ display: 'none' }}>
            <span className="text-sm font-bold tracking-tight text-foreground">HÖGANÄS</span>
          </div>
          <div className="h-5 w-px bg-border" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Material Selector</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Search className="h-4 w-4" />
          </button>
          <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground sm:inline-flex">
            EN / SV / DE
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
