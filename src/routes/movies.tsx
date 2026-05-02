import { createFileRoute } from "@tanstack/react-router";
import { MOVIES } from "@/mvp/model";
import { MovieCard } from "@/components/MovieCard";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "All Movies — Lumière" },
      { name: "description", content: "Explore every film currently showing at Lumière." },
    ],
  }),
  component: MoviesPage,
});

function MoviesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <span className="text-xs tracking-[0.25em] uppercase text-primary">Showtimes</span>
      <h1 className="font-display text-5xl mt-2 mb-3">All Films</h1>
      <p className="text-muted-foreground max-w-xl mb-12">
        Pick a title to view showtimes and reserve your seats.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOVIES.map((m) => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  );
}
