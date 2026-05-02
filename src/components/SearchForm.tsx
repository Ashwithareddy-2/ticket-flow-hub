import { ArrowLeftRight, Calendar, MapPin, Search } from "lucide-react";
import { STATIONS } from "@/mvp/model";

type Props = {
  from: string; setFrom: (v: string) => void;
  to: string; setTo: (v: string) => void;
  date: string; setDate: (v: string) => void;
  onSubmit: () => void;
  variant?: "hero" | "page";
};

export function SearchForm({ from, setFrom, to, setTo, date, setDate, onSubmit, variant = "hero" }: Props) {
  const swap = () => { const f = from; setFrom(to); setTo(f); };
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className={`relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_auto] gap-3 p-4 rounded-2xl bg-card border border-border/70 ${variant === "hero" ? "md:p-5" : ""}`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <Field icon={<MapPin className="w-4 h-4" />} label="From">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium">
          <option value="">Select origin</option>
          {STATIONS.map((s) => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
        </select>
      </Field>

      <button
        type="button"
        onClick={swap}
        aria-label="Swap stations"
        className="hidden md:flex items-center justify-center w-10 h-10 self-center rounded-full border border-border bg-background hover:border-accent hover:text-accent transition"
      >
        <ArrowLeftRight className="w-4 h-4" />
      </button>

      <Field icon={<MapPin className="w-4 h-4" />} label="To">
        <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium">
          <option value="">Select destination</option>
          {STATIONS.map((s) => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
        </select>
      </Field>

      <Field icon={<Calendar className="w-4 h-4" />} label="Travel date">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          className="w-full bg-transparent outline-none text-sm font-medium"
        />
      </Field>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-primary-foreground hover:opacity-90 transition"
        style={{ background: "var(--gradient-deep)" }}
      >
        <Search className="w-4 h-4" /> Search
      </button>
    </form>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-transparent focus-within:border-accent transition cursor-text">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground inline-flex items-center gap-1.5">
        {icon}{label}
      </span>
      {children}
    </label>
  );
}
