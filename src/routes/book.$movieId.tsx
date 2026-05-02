import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getMovie, SHOWTIMES } from "@/mvp/model";
import { useBookingFlowPresenter } from "@/mvp/presenter";
import { SeatGrid } from "@/components/SeatGrid";
import { Clock, Star, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/book/$movieId")({
  component: BookPage,
  notFoundComponent: () => (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Movie not found</h1>
      <Link to="/movies" className="mt-6 inline-block text-primary">Back to movies</Link>
    </div>
  ),
});

function BookPage() {
  const { movieId } = Route.useParams();
  const movie = getMovie(movieId);
  const navigate = useNavigate();
  const p = useBookingFlowPresenter(movieId);

  if (!movie) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Movie not found</h1>
        <Link to="/movies" className="mt-6 inline-block text-primary">Back to movies</Link>
      </div>
    );
  }

  const total = p.selectedSeats.length * movie.price;

  const onConfirm = () => {
    const booking = p.submit(movie.title, movie.price);
    if (booking) navigate({ to: "/tickets" });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/movies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> All movies
      </Link>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10">
        {/* Movie info */}
        <div>
          <div
            className="aspect-[2/3] rounded-xl mb-6 relative overflow-hidden"
            style={{ background: movie.poster, boxShadow: "var(--shadow-elegant)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute top-4 right-4 px-2 py-0.5 text-xs rounded bg-black/60 backdrop-blur text-primary border border-primary/30">
              {movie.rating}
            </span>
          </div>
          <h1 className="font-display text-4xl">{movie.title}</h1>
          <p className="text-primary text-sm mt-1">{movie.genre}</p>
          <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{movie.duration}</span>
            <span className="inline-flex items-center gap-1 text-primary"><Star className="w-4 h-4 fill-current" />${movie.price}/seat</span>
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{movie.synopsis}</p>
        </div>

        {/* Booking flow */}
        <div className="space-y-8 p-6 md:p-8 rounded-xl border border-border/50 bg-card/50">
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">1. Showtime</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {SHOWTIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => p.setShowtime(t)}
                  className={`py-3 rounded-md text-sm transition ${
                    p.showtime === t
                      ? "text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/70"
                  }`}
                  style={p.showtime === t ? { background: "var(--gradient-gold)" } : undefined}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {p.showtime && (
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">2. Seats</label>
              <div className="mt-4">
                <SeatGrid selected={p.selectedSeats} booked={p.bookedSeats} onToggle={p.toggleSeat} />
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Name</label>
              <input
                value={p.name}
                onChange={(e) => p.setName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-2 w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Email</label>
              <input
                type="email"
                value={p.email}
                onChange={(e) => p.setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="mt-2 w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">Total</p>
              <p className="font-display text-3xl text-primary">${total}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {p.selectedSeats.length} seat{p.selectedSeats.length === 1 ? "" : "s"}
                {p.selectedSeats.length > 0 && ` · ${p.selectedSeats.join(", ")}`}
              </p>
            </div>
            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-3 rounded-md font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
