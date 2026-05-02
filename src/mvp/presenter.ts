// PRESENTER — coordinates Model + UI state. Views call these hooks.

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookingModel, getTrain, type Passenger, type Train } from "./model";
import { toast } from "sonner";

export function useTrainSearchPresenter() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [results, setResults] = useState<Train[] | null>(null);

  const search = () => {
    if (!from || !to) {
      toast.error("Please choose origin and destination");
      return;
    }
    if (from === to) {
      toast.error("Origin and destination must differ");
      return;
    }
    setResults(BookingModel.searchTrains(from, to));
  };

  return { from, setFrom, to, setTo, date, setDate, results, search };
}

export function useBookingFlowPresenter(trainId: string) {
  const train = getTrain(trainId);
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [classCode, setClassCode] = useState<"EC" | "FC" | "BC" | "">("");
  const [passengers, setPassengers] = useState<Passenger[]>([{ name: "", age: 0 }]);
  const [email, setEmail] = useState("");

  const selectedClass = useMemo(
    () => train?.classes.find((c) => c.code === classCode),
    [train, classCode],
  );

  const seatsTaken = useMemo(() => {
    if (!train || !classCode) return 0;
    return BookingModel.bookedSeatCount(train.id, travelDate, classCode);
  }, [train, classCode, travelDate]);

  const seatsAvailable = selectedClass ? selectedClass.seatsTotal - seatsTaken : 0;
  const totalFare = selectedClass ? selectedClass.price * passengers.length : 0;

  const updatePassenger = (i: number, p: Partial<Passenger>) => {
    setPassengers((arr) => arr.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  };
  const addPassenger = () => {
    if (passengers.length >= 6) return toast.error("Up to 6 passengers per booking");
    setPassengers((a) => [...a, { name: "", age: 0 }]);
  };
  const removePassenger = (i: number) => {
    setPassengers((a) => a.filter((_, idx) => idx !== i));
  };

  const submit = () => {
    if (!train) return null;
    if (!classCode || !selectedClass) { toast.error("Please choose a class"); return null; }
    if (passengers.some((p) => !p.name.trim() || !p.age)) {
      toast.error("Please complete passenger details"); return null;
    }
    if (!email.trim()) { toast.error("Please enter contact email"); return null; }
    if (passengers.length > seatsAvailable) {
      toast.error(`Only ${seatsAvailable} seats left in this class`); return null;
    }
    try {
      const booking = BookingModel.create({
        trainId: train.id,
        trainName: train.name,
        trainNumber: train.number,
        fromCode: train.fromCode,
        toCode: train.toCode,
        fromName: "",
        toName: "",
        departure: train.departure,
        arrival: train.arrival,
        travelDate,
        classCode,
        classLabel: selectedClass.label,
        passengers,
        totalFare,
        email,
      });
      toast.success("Booking confirmed", { description: `PNR ${booking.pnr}` });
      return booking;
    } catch (e) {
      toast.error((e as Error).message);
      return null;
    }
  };

  return {
    train, travelDate, setTravelDate, classCode, setClassCode,
    passengers, updatePassenger, addPassenger, removePassenger,
    email, setEmail, selectedClass, seatsAvailable, totalFare, submit,
  };
}

export function useBookingsPresenter() {
  const [bookings, setBookings] = useState(BookingModel.getAll());
  const refresh = useCallback(() => setBookings(BookingModel.getAll()), []);
  useEffect(() => { refresh(); }, [refresh]);
  const cancel = useCallback((pnr: string) => {
    BookingModel.cancel(pnr);
    refresh();
    toast.success("Booking cancelled", { description: `PNR ${pnr} removed.` });
  }, [refresh]);
  return { bookings, cancel, refresh };
}
