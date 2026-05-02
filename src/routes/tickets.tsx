import { createFileRoute, Link } from "@tanstack/react-router";
import { useBookingsPresenter } from "@/mvp/presenter";
import { getStationName } from "@/mvp/model";
import { Ticket, Calendar, ArrowRight, Trash2, Users, MapPin } from "lucide-react";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — Rails & Co." },
      { name: "description", content: "View, manage, and cancel your train bookings." },
    ],
  }),
  component: TicketsPage,
});

function TicketsPage() {
  const { bookings, cancel } = useBookingsPresenter();

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <span className="text-xs tracking-[0.25em] uppercase text-accent">Reservations</span>
      <h1 className="font-display text-5xl mt-2 mb-3">My Tickets</h1>
      <p className="text-muted-foreground mb-10">All your active bookings, ready for the platform.</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card/40">
          <Ticket className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="font-display text-2xl">No tickets yet</h2>
          <p className="text-muted-foreground mt-2">Book your first journey to see it appear here.</p>
          <Link
            to="/search"
            className="mt-6 inline-block px-6 py-3 rounded-md font-medium text-primary-foreground"
            style={{ background: "var(--gradient-deep)" }}
          >
            Find Trains
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((b) => (
            <article
              key={b.pnr}
              className="grid md:grid-cols-[1fr_220px] gap-0 rounded-2xl overflow-hidden border border-border/70 bg-card"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* Main */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground">Train №{b.trainNumber} · {b.classLabel}</p>
                    <h3 className="font-display text-2xl mt-0.5">{b.trainName}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancel(b.pnr)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs border border-border hover:border-destructive hover:text-destructive transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-display text-xl">{b.departure}</div>
                    <div className="text-xs text-muted-foreground">{b.fromCode} · {getStationName(b.fromCode)}</div>
                  </div>
                  <div className="flex-1 flex items-center gap-1 text-muted-foreground/60">
                    <div className="flex-1 h-px bg-border" />
                    <ArrowRight className="w-3.5 h-3.5" />
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div>
                    <div className="font-display text-xl">{b.arrival}</div>
                    <div className="text-xs text-muted-foreground">{b.toCode} · {getStationName(b.toCode)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{b.travelDate}</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{b.passengers.length} passenger{b.passengers.length === 1 ? "" : "s"}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Seats {b.seats.join(", ")}</span>
                </div>
              </div>

              {/* Stub (perforation) */}
              <div className="relative border-t md:border-t-0 md:border-l border-dashed border-border/80 p-6 flex flex-col justify-between bg-secondary/40">
                <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background" />
                <div className="hidden md:block absolute -left-2 top-4 w-4 h-4 rounded-full bg-background" />
                <div className="hidden md:block absolute -left-2 bottom-4 w-4 h-4 rounded-full bg-background" />

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">PNR</p>
                  <p className="font-display text-xl tracking-wider">{b.pnr}</p>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Total Fare</p>
                  <p className="font-display text-2xl text-primary">₹{b.totalFare}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
