import { Link } from "@tanstack/react-router";
import { Clock, Star } from "lucide-react";
import type { Movie } from "@/mvp/model";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      to="/book/$movieId"
      params={{ movieId: movie.id }}
      className="group block rounded-xl overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all hover:-translate-y-1"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div
        className="aspect-[2/3] relative flex items-end p-5"
        style={{ background: movie.poster }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10">
          <span className="inline-block px-2 py-0.5 text-xs rounded bg-black/50 backdrop-blur text-primary border border-primary/30">
            {movie.rating}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-2">
        <h3 className="font-display text-xl group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground">{movie.genre}</p>
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{movie.duration}</span>
          <span className="inline-flex items-center gap-1 text-primary"><Star className="w-3 h-3 fill-current" />${movie.price}</span>
        </div>
      </div>
    </Link>
  );
}
