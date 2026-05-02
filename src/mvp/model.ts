// MODEL — data + business logic (no UI)
// Persists bookings to localStorage. Independent of any view.

export type Movie = {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  price: number;
  poster: string; // gradient bg
  synopsis: string;
};

export type Booking = {
  id: string;
  movieId: string;
  movieTitle: string;
  customerName: string;
  email: string;
  showtime: string;
  seats: string[];
  totalPrice: number;
  createdAt: string;
};

const STORAGE_KEY = "lumiere_bookings_v1";

export const MOVIES: Movie[] = [
  {
    id: "dune-3",
    title: "Dune: Part Three",
    genre: "Sci-Fi Epic",
    duration: "2h 46m",
    rating: "PG-13",
    price: 18,
    poster: "linear-gradient(135deg, #c87f3a, #3a1f0a)",
    synopsis: "Paul Atreides confronts the cost of prophecy as empires collide on Arrakis.",
  },
  {
    id: "neon-skies",
    title: "Neon Skies",
    genre: "Cyberpunk Thriller",
    duration: "2h 12m",
    rating: "R",
    price: 16,
    poster: "linear-gradient(135deg, #d946ef, #1e1b4b)",
    synopsis: "A rogue archivist races through a rain-soaked megacity to erase her own past.",
  },
  {
    id: "the-quiet-shore",
    title: "The Quiet Shore",
    genre: "Drama",
    duration: "1h 58m",
    rating: "PG",
    price: 14,
    poster: "linear-gradient(135deg, #14b8a6, #0f172a)",
    synopsis: "Two strangers find unexpected solace during a single off-season weekend.",
  },
  {
    id: "midnight-heist",
    title: "Midnight Heist",
    genre: "Action",
    duration: "2h 04m",
    rating: "PG-13",
    price: 16,
    poster: "linear-gradient(135deg, #f59e0b, #7c2d12)",
    synopsis: "A retired thief is pulled into one final, impossible job across three cities.",
  },
  {
    id: "ember-and-ash",
    title: "Ember & Ash",
    genre: "Fantasy",
    duration: "2h 32m",
    rating: "PG-13",
    price: 17,
    poster: "linear-gradient(135deg, #ef4444, #18181b)",
    synopsis: "Twin heirs to a dying kingdom must choose between blood and a burning world.",
  },
  {
    id: "afterlight",
    title: "Afterlight",
    genre: "Mystery",
    duration: "1h 49m",
    rating: "PG-13",
    price: 15,
    poster: "linear-gradient(135deg, #8b5cf6, #1e1b4b)",
    synopsis: "A grief counselor begins receiving voicemails from a number that doesn't exist.",
  },
];

export const SHOWTIMES = ["12:30 PM", "3:45 PM", "6:30 PM", "9:15 PM"];

function load(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export const BookingModel = {
  getAll(): Booking[] {
    return load();
  },
  getById(id: string): Booking | undefined {
    return load().find((b) => b.id === id);
  },
  create(input: Omit<Booking, "id" | "createdAt">): Booking {
    const all = load();
    // business rule: prevent duplicate seats for same movie + showtime
    const conflict = all.some(
      (b) =>
        b.movieId === input.movieId &&
        b.showtime === input.showtime &&
        b.seats.some((s) => input.seats.includes(s)),
    );
    if (conflict) throw new Error("One or more seats are already booked for this showtime.");
    const booking: Booking = {
      ...input,
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    save([booking, ...all]);
    return booking;
  },
  cancel(id: string): void {
    save(load().filter((b) => b.id !== id));
  },
  getBookedSeats(movieId: string, showtime: string): string[] {
    return load()
      .filter((b) => b.movieId === movieId && b.showtime === showtime)
      .flatMap((b) => b.seats);
  },
};

export function getMovie(id: string): Movie | undefined {
  return MOVIES.find((m) => m.id === id);
}
