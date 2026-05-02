import { createFileRoute, Link } from "@tanstack/react-router";
import { useBookingsPresenter } from "@/mvp/presenter";
import { Ticket, Calendar, MapPin, Trash2 } from "lucide-react";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — Lumière" },
      { name: "description", content: "View and manage your movie ticket bookings." },
    ],
  }),
  component: TicketsPage,
});

function TicketsPage() {
  const { bookings, cancel } = useBookingsPresenter();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <span className="text-xs tracking-[0.25em] uppercase text-primary">Reservations</span>
      <h1 className="font-display text-5xl mt-2 mb-3">My Tickets</h1>
      <p className="text-muted-foreground mb-12">Your active bookings, ready at the door.</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border">
          <Ticket className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="font-display text-2xl">No tickets yet</h2>
          <p className="text-muted-foreground mt-2">Book your first show to see it appear here.</p>
          <Link
            to="/movies"
            className="mt-6 inline-block px-6 py-3 rounded-md font-medium text-primary-foreground"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <article
              key={b.id}
              className="grid md:grid-cols-[1fr_auto] gap-6 items-center p-6 rounded-xl border border-border/50 bg-card/60"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div className="flex gap-6 items-center">
                <div
                  className="w-16 h-20 rounded-md flex items-center justify-center"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  <Ticket className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-2xl">{b.movieTitle}</h3>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" />{b.showtime}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />Seats {b.seats.join(", ")}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground/70 pt-1">
                    <span>Ref: <span className="text-primary">{b.id}</span></span>
                    <span>{b.customerName}</span>
                    <span className="text-primary">${b.totalPrice}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => cancel(b.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-border hover:border-destructive hover:text-destructive transition"
              >
                <Trash2 className="w-4 h-4" /> Cancel
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
