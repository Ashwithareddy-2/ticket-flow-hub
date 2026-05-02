import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-cinema.jpg";
import { MOVIES } from "@/mvp/model";
import { MovieCard } from "@/components/MovieCard";
import { ArrowRight, Ticket, Calendar, XCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumière — Book Cinema Tickets" },
      { name: "description", content: "Discover now showing films and reserve seats in seconds." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = MOVIES.slice(0, 3);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Cinema interior"
          width={1920}
          height={1088}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, var(--background) 95%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-44">
          <span className="inline-block px-3 py-1 rounded-full text-xs tracking-[0.25em] uppercase border border-primary/40 text-primary mb-6">
            Now Showing
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-3xl leading-[0.95]">
            Where every seat tells a <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>story</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Reserve your seat for the season's most anticipated films. Instant confirmation, easy cancellation.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium text-primary-foreground hover:opacity-90 transition"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              Browse Movies <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tickets"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium border border-border hover:border-primary/50 hover:text-primary transition"
            >
              <Ticket className="w-4 h-4" /> My Tickets
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Calendar, title: "Pick Your Showtime", desc: "Four daily screenings across every title." },
          { icon: Ticket, title: "Choose Your Seat", desc: "Real-time seat map with instant availability." },
          { icon: XCircle, title: "Cancel Anytime", desc: "Plans changed? Cancel with a single click." },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-xl border border-border/50 bg-card/50">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "var(--gradient-gold)" }}>
              <f.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-primary">Featured</span>
            <h2 className="font-display text-4xl mt-2">This Week's Premieres</h2>
          </div>
          <Link to="/movies" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      </section>
    </div>
  );
}
