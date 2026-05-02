import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect } from "react";
import { getTrain, getStationName } from "@/mvp/model";
import { useBookingFlowPresenter } from "@/mvp/presenter";
import { ArrowLeft, Plus, Trash2, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/book/$trainId")({
  validateSearch: z.object({ date: z.string().optional() }),
  component: BookPage,
  notFoundComponent: () => (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Train not found</h1>
      <Link to="/search" className="mt-6 inline-block text-primary">Find another</Link>
    </div>
  ),
});

function BookPage() {
  const { trainId } = Route.useParams();
  const sp = Route.useSearch();
  const train = getTrain(trainId);
  const navigate = useNavigate();
  const p = useBookingFlowPresenter(trainId);

  useEffect(() => {
    if (sp.date) p.setTravelDate(sp.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.date]);

  if (!train) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Train not found</h1>
        <Link to="/search" className="mt-6 inline-block text-primary">Search trains</Link>
      </div>
    );
  }

  const onConfirm = () => {
    const b = p.submit();
    if (b) navigate({ to: "/tickets" });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to results
      </Link>

      {/* Train summary */}
      <div className="p-6 rounded-2xl bg-card border border-border/70" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Train №{train.number}</p>
            <h1 className="font-display text-3xl mt-1">{train.name}</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-display text-2xl">{train.departure}</div>
              <div className="text-xs text-muted-foreground">{getStationName(train.fromCode)}</div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{train.duration}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="text-center">
              <div className="font-display text-2xl">{train.arrival}</div>
              <div className="text-xs text-muted-foreground">{getStationName(train.toCode)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 mt-6">
        {/* Form */}
        <div className="space-y-6">
          <Section step="1" title="Travel date">
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={p.travelDate}
              onChange={(e) => p.setTravelDate(e.target.value)}
              className="px-4 py-3 rounded-md bg-input border border-border focus:border-accent outline-none"
            />
          </Section>

          <Section step="2" title="Choose class">
            <div className="grid sm:grid-cols-3 gap-3">
              {train.classes.map((c) => {
                const active = p.classCode === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => p.setClassCode(c.code)}
                    className={`text-left p-4 rounded-xl border transition ${
                      active ? "border-accent bg-accent/10" : "border-border hover:border-accent/50 bg-secondary/40"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.code}</p>
                    <p className="font-display text-lg mt-0.5">{c.label}</p>
                    <p className="text-primary mt-2 font-medium">₹{c.price}<span className="text-xs text-muted-foreground"> /seat</span></p>
                    <p className="text-xs text-muted-foreground mt-1">{c.seatsTotal} seats</p>
                  </button>
                );
              })}
            </div>
            {p.selectedClass && (
              <p className="text-xs text-muted-foreground mt-3">
                <span className={p.seatsAvailable < 5 ? "text-destructive" : "text-primary"}>{p.seatsAvailable}</span> seats available on {p.travelDate}
              </p>
            )}
          </Section>

          <Section step="3" title="Passengers">
            <div className="space-y-3">
              {p.passengers.map((pax, i) => (
                <div key={i} className="grid grid-cols-[1fr_100px_auto] gap-3 items-center">
                  <input
                    placeholder={`Passenger ${i + 1} full name`}
                    value={pax.name}
                    onChange={(e) => p.updatePassenger(i, { name: e.target.value })}
                    className="px-4 py-3 rounded-md bg-input border border-border focus:border-accent outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    min={1} max={120}
                    value={pax.age || ""}
                    onChange={(e) => p.updatePassenger(i, { age: parseInt(e.target.value) || 0 })}
                    className="px-4 py-3 rounded-md bg-input border border-border focus:border-accent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => p.removePassenger(i)}
                    disabled={p.passengers.length === 1}
                    aria-label="Remove passenger"
                    className="w-10 h-10 rounded-md border border-border hover:border-destructive hover:text-destructive transition disabled:opacity-30 inline-flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={p.addPassenger}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition"
              >
                <Plus className="w-4 h-4" /> Add passenger
              </button>
            </div>
          </Section>

          <Section step="4" title="Contact">
            <input
              type="email"
              placeholder="you@example.com"
              value={p.email}
              onChange={(e) => p.setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-accent outline-none"
            />
          </Section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl bg-card border border-border/70" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-display text-xl mb-4">Fare summary</h3>
          <dl className="space-y-2.5 text-sm">
            <Row label="Train" value={train.name} />
            <Row label="Date" value={p.travelDate} />
            <Row label="Class" value={p.selectedClass?.label ?? "—"} />
            <Row label="Passengers" value={String(p.passengers.length)} />
            <Row label="Per seat" value={p.selectedClass ? `₹${p.selectedClass.price}` : "—"} />
          </dl>
          <div className="border-t border-border my-4" />
          <div className="flex items-end justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="font-display text-3xl text-primary">₹{p.totalFare}</span>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full mt-5 px-6 py-3.5 rounded-xl font-medium transition hover:opacity-90"
            style={{ background: "var(--gradient-amber)", color: "oklch(0.22 0.04 200)", boxShadow: "var(--shadow-amber)" }}
          >
            Confirm Booking
          </button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            You'll receive a PNR instantly after confirmation.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="p-6 rounded-2xl bg-card border border-border/70" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-full text-xs font-medium inline-flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-deep)" }}>
          {step}
        </span>
        <h3 className="font-display text-lg">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
