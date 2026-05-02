// MODEL — railway data + business logic. UI-independent.
// Persists bookings to localStorage.

export type Station = { code: string; name: string };

export type Train = {
  id: string;
  number: string;
  name: string;
  fromCode: string;
  toCode: string;
  departure: string; // "06:30"
  arrival: string;   // "10:45"
  duration: string;  // "4h 15m"
  classes: { code: "EC" | "FC" | "BC"; label: string; price: number; seatsTotal: number }[];
};

export type Passenger = { name: string; age: number };

export type Booking = {
  pnr: string;
  trainId: string;
  trainName: string;
  trainNumber: string;
  fromCode: string;
  toCode: string;
  fromName: string;
  toName: string;
  departure: string;
  arrival: string;
  travelDate: string; // YYYY-MM-DD
  classCode: "EC" | "FC" | "BC";
  classLabel: string;
  passengers: Passenger[];
  seats: string[];
  totalFare: number;
  email: string;
  createdAt: string;
};

export const STATIONS: Station[] = [
  { code: "NDL", name: "New Delhi" },
  { code: "BCT", name: "Mumbai Central" },
  { code: "MAS", name: "Chennai Central" },
  { code: "HWH", name: "Howrah Junction" },
  { code: "SBC", name: "Bengaluru City" },
  { code: "PUNE", name: "Pune Junction" },
  { code: "JP", name: "Jaipur Junction" },
  { code: "ADI", name: "Ahmedabad Junction" },
];

export const TRAINS: Train[] = [
  {
    id: "t-12951",
    number: "12951",
    name: "Rajdhani Express",
    fromCode: "NDL",
    toCode: "BCT",
    departure: "16:25",
    arrival: "08:15",
    duration: "15h 50m",
    classes: [
      { code: "EC", label: "Executive", price: 4200, seatsTotal: 24 },
      { code: "FC", label: "First Class", price: 2800, seatsTotal: 36 },
      { code: "BC", label: "Business", price: 1650, seatsTotal: 60 },
    ],
  },
  {
    id: "t-22691",
    number: "22691",
    name: "Vande Bharat",
    fromCode: "SBC",
    toCode: "MAS",
    departure: "06:00",
    arrival: "10:55",
    duration: "4h 55m",
    classes: [
      { code: "EC", label: "Executive", price: 2950, seatsTotal: 24 },
      { code: "FC", label: "First Class", price: 1890, seatsTotal: 48 },
    ],
  },
  {
    id: "t-12259",
    number: "12259",
    name: "Sealdah Duronto",
    fromCode: "HWH",
    toCode: "NDL",
    departure: "20:05",
    arrival: "12:35",
    duration: "16h 30m",
    classes: [
      { code: "FC", label: "First Class", price: 3100, seatsTotal: 36 },
      { code: "BC", label: "Business", price: 1750, seatsTotal: 60 },
    ],
  },
  {
    id: "t-12009",
    number: "12009",
    name: "Shatabdi Express",
    fromCode: "BCT",
    toCode: "ADI",
    departure: "06:25",
    arrival: "13:05",
    duration: "6h 40m",
    classes: [
      { code: "EC", label: "Executive", price: 1850, seatsTotal: 24 },
      { code: "FC", label: "First Class", price: 1190, seatsTotal: 48 },
    ],
  },
  {
    id: "t-11077",
    number: "11077",
    name: "Jhelum Express",
    fromCode: "PUNE",
    toCode: "JP",
    departure: "17:20",
    arrival: "16:10",
    duration: "22h 50m",
    classes: [
      { code: "FC", label: "First Class", price: 2400, seatsTotal: 36 },
      { code: "BC", label: "Business", price: 1290, seatsTotal: 72 },
    ],
  },
  {
    id: "t-12627",
    number: "12627",
    name: "Karnataka Express",
    fromCode: "NDL",
    toCode: "SBC",
    departure: "20:45",
    arrival: "06:30",
    duration: "33h 45m",
    classes: [
      { code: "FC", label: "First Class", price: 3450, seatsTotal: 36 },
      { code: "BC", label: "Business", price: 1850, seatsTotal: 72 },
    ],
  },
];

const STORAGE_KEY = "railsco_bookings_v1";

function load(): Booking[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}
function save(b: Booking[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); }

function generatePNR(): string {
  const n = Math.floor(1000000000 + Math.random() * 9000000000);
  return String(n);
}

export const BookingModel = {
  getAll(): Booking[] { return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  getByPNR(pnr: string) { return load().find((b) => b.pnr === pnr); },
  searchTrains(fromCode: string, toCode: string): Train[] {
    if (!fromCode || !toCode) return TRAINS;
    return TRAINS.filter((t) => t.fromCode === fromCode && t.toCode === toCode);
  },
  bookedSeatCount(trainId: string, travelDate: string, classCode: string): number {
    return load()
      .filter((b) => b.trainId === trainId && b.travelDate === travelDate && b.classCode === classCode)
      .reduce((sum, b) => sum + b.seats.length, 0);
  },
  create(input: Omit<Booking, "pnr" | "createdAt" | "seats"> & { seats?: string[] }): Booking {
    const trainClass = TRAINS.find((t) => t.id === input.trainId)?.classes.find((c) => c.code === input.classCode);
    if (!trainClass) throw new Error("Invalid class selection.");
    const taken = this.bookedSeatCount(input.trainId, input.travelDate, input.classCode);
    if (taken + input.passengers.length > trainClass.seatsTotal) {
      throw new Error("Not enough seats available in this class for that date.");
    }
    const startSeat = taken + 1;
    const seats = input.passengers.map((_, i) => `${input.classCode}-${String(startSeat + i).padStart(2, "0")}`);
    const booking: Booking = {
      ...input,
      seats,
      pnr: generatePNR(),
      createdAt: new Date().toISOString(),
    };
    save([booking, ...load()]);
    return booking;
  },
  cancel(pnr: string) { save(load().filter((b) => b.pnr !== pnr)); },
};

export function getStationName(code: string) {
  return STATIONS.find((s) => s.code === code)?.name ?? code;
}
export function getTrain(id: string) {
  return TRAINS.find((t) => t.id === id);
}
