import { createFileRoute, Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import heroImg from "@/assets/hero-railway.jpg";
import { TRAINS } from "@/mvp/model";
import { TrainCard } from "@/components/TrainCard";
import { SearchForm } from "@/components/SearchForm";
import { useTrainSearchPresenter } from "@/mvp/presenter";
import { ArrowRight, ShieldCheck, Zap, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rails & Co. — Effortless Train Tickets" },
      { name: "description", content: "Search trains, reserve seats, and manage your journey in seconds." },
    ],
  }),
  component: Home,
});

function Home() {
  const p = useTrainSearchPresenter();
  const navigate = useNavigate();
  const popular = TRAINS.slice(0, 3);

  const onSearch = () => {
    p.search();
    navigate({
      to: "/search",
      search: { from: p.from, to: p.to, date: p.date },
    });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="Train arriving at golden-hour station" width={1920} height={1088}
             className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.16 0.025 220 / 0.55) 0%, var(--background) 95%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 md:pt-40 md:pb-24">
          <span className="inline-block px-3 py-1 rounded-full text-xs tracking-[0.25em] uppercase bg-background/70 backdrop-blur border border-border text-primary mb-6">
            Smarter Rail Travel
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] max-w-3xl leading-[0.95] text-primary-foreground" style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}>
            The journey begins with a <em className="not-italic" style={{ background: "var(--gradient-amber)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>single click</em>.
          </h1>
          <p className="mt-6 text-lg max-w-xl text-primary-foreground/90">
            Find trains, choose your class, and confirm your seats — all in one place.
          </p>

          <div className="mt-10">
            <SearchForm
              from={p.from} setFrom={p.setFrom}
              to={p.to} setTo={p.setTo}
              date={p.date} setDate={p.setDate}
              onSubmit={onSearch}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Zap, title: "Instant Booking", desc: "Confirm your seats in under a minute. No queues, no paperwork." },
          { icon: ShieldCheck, title: "Secure & Reliable", desc: "Your PNR and passenger data are protected end-to-end." },
          { icon: RefreshCcw, title: "Easy Cancellation", desc: "Plans changed? Cancel any booking with a single click." },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-2xl border border-border/70 bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-primary-foreground" style={{ background: "var(--gradient-deep)" }}>
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* POPULAR ROUTES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-accent">Popular Routes</span>
            <h2 className="font-display text-4xl mt-2">This week's most-booked trains</h2>
          </div>
          <Link to="/search" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {popular.map((t) => <TrainCard key={t.id} train={t} />)}
        </div>
      </section>
    </div>
  );
}
