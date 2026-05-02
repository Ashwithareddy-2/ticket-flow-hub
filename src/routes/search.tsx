import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect } from "react";
import { useTrainSearchPresenter } from "@/mvp/presenter";
import { SearchForm } from "@/components/SearchForm";
import { TrainCard } from "@/components/TrainCard";
import { TRAINS, getStationName } from "@/mvp/model";
import { TrainFront } from "lucide-react";

const searchSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Find Trains — Rails & Co." },
      { name: "description", content: "Search across our network for the perfect train." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const sp = Route.useSearch();
  const p = useTrainSearchPresenter();

  // Sync URL search params into presenter on mount/changes
  useEffect(() => {
    if (sp.from) p.setFrom(sp.from);
    if (sp.to) p.setTo(sp.to);
    if (sp.date) p.setDate(sp.date);
    if (sp.from && sp.to) p.search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.from, sp.to, sp.date]);

  const list = p.results ?? TRAINS;
  const heading = p.results
    ? `${list.length} train${list.length === 1 ? "" : "s"} · ${getStationName(p.from)} → ${getStationName(p.to)}`
    : "All trains in our network";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <span className="text-xs tracking-[0.25em] uppercase text-accent">Find Trains</span>
      <h1 className="font-display text-4xl md:text-5xl mt-2 mb-8">Where are we going today?</h1>

      <SearchForm
        from={p.from} setFrom={p.setFrom}
        to={p.to} setTo={p.setTo}
        date={p.date} setDate={p.setDate}
        onSubmit={p.search}
        variant="page"
      />

      <div className="mt-12">
        <h2 className="font-display text-2xl mb-5">{heading}</h2>
        {list.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border">
            <TrainFront className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No direct trains for this route. Try a different pair.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((t) => <TrainCard key={t.id} train={t} travelDate={p.date} />)}
          </div>
        )}
      </div>
    </div>
  );
}
