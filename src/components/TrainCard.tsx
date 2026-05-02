import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, TrainFront } from "lucide-react";
import { getStationName, type Train } from "@/mvp/model";

export function TrainCard({ train, travelDate }: { train: Train; travelDate?: string }) {
  const minPrice = Math.min(...train.classes.map((c) => c.price));
  return (
    <article
      className="grid md:grid-cols-[1fr_auto] gap-6 items-center p-6 rounded-xl bg-card border border-border/70 hover:border-accent/50 transition-all"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-deep)" }}>
            <TrainFront className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-xl leading-tight">{train.name}</h3>
            <p className="text-xs text-muted-foreground">Train №{train.number}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-display text-2xl">{train.departure}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{train.fromCode} · {getStationName(train.fromCode)}</div>
          </div>
          <div className="flex-1 flex items-center gap-2 text-muted-foreground/70 px-2">
            <div className="flex-1 h-px bg-border" />
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{train.duration}</span>
            <div className="flex-1 h-px bg-border" />
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div className="text-center">
            <div className="font-display text-2xl">{train.arrival}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{train.toCode} · {getStationName(train.toCode)}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {train.classes.map((c) => (
            <span key={c.code} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
              {c.label} · ₹{c.price}
            </span>
          ))}
        </div>
      </div>

      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 md:border-l md:border-border md:pl-6">
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">From</p>
          <p className="font-display text-2xl text-primary">₹{minPrice}</p>
        </div>
        <Link
          to="/book/$trainId"
          params={{ trainId: train.id }}
          search={travelDate ? { date: travelDate } : undefined}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          style={{ background: "var(--gradient-amber)", boxShadow: "var(--shadow-amber)", color: "oklch(0.22 0.04 200)" }}
        >
          Book Seats <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
