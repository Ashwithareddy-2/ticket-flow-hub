import { Link, useRouterState } from "@tanstack/react-router";
import { Film, Ticket } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/tickets", label: "My Tickets" },
];

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl tracking-tight">Lumière</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            to="/movies"
            className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <Ticket className="w-4 h-4" />
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
