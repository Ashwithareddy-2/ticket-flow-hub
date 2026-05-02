// VIEW component — pure presentation. State is owned by presenter.

const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export function SeatGrid({
  selected,
  booked,
  onToggle,
}: {
  selected: string[];
  booked: string[];
  onToggle: (seat: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div
          className="h-2 rounded-full mx-auto w-3/4"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
        />
        <p className="text-center text-xs text-muted-foreground mt-2 tracking-[0.3em] uppercase">Screen</p>
      </div>
      <div className="space-y-2">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-6 text-xs text-muted-foreground">{row}</span>
            <div className="flex gap-2">
              {COLS.map((col) => {
                const seat = `${row}${col}`;
                const isBooked = booked.includes(seat);
                const isSelected = selected.includes(seat);
                return (
                  <button
                    key={seat}
                    type="button"
                    disabled={isBooked}
                    onClick={() => onToggle(seat)}
                    aria-label={`Seat ${seat}`}
                    className={`w-9 h-9 rounded-md text-xs font-medium transition-all ${
                      isBooked
                        ? "bg-muted text-muted-foreground/40 cursor-not-allowed"
                        : isSelected
                        ? "text-primary-foreground scale-110"
                        : "bg-secondary hover:bg-secondary/70 text-foreground/70"
                    }`}
                    style={isSelected ? { background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" } : undefined}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-4">
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-secondary" /> Available</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded" style={{ background: "var(--gradient-gold)" }} /> Selected</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-muted" /> Taken</span>
      </div>
    </div>
  );
}
