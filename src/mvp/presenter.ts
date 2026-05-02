// PRESENTER — middle layer between View (React components) and Model.
// Views call presenter hooks; presenter coordinates Model + UI state.

import { useCallback, useEffect, useState } from "react";
import { BookingModel, type Booking } from "./model";
import { toast } from "sonner";

export function useBookingsPresenter() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const refresh = useCallback(() => {
    setBookings(BookingModel.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const cancel = useCallback(
    (id: string) => {
      BookingModel.cancel(id);
      refresh();
      toast.success("Booking cancelled", { description: `Reference ${id} has been removed.` });
    },
    [refresh],
  );

  return { bookings, cancel, refresh };
}

export function useBookingFlowPresenter(movieId: string) {
  const [showtime, setShowtime] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (showtime) setBookedSeats(BookingModel.getBookedSeats(movieId, showtime));
    setSelectedSeats([]);
  }, [movieId, showtime]);

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((s) => (s.includes(seat) ? s.filter((x) => x !== seat) : [...s, seat]));
  };

  const submit = (movieTitle: string, pricePerSeat: number): Booking | null => {
    if (!showtime) {
      toast.error("Please select a showtime");
      return null;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return null;
    }
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return null;
    }
    try {
      const booking = BookingModel.create({
        movieId,
        movieTitle,
        customerName: name.trim(),
        email: email.trim(),
        showtime,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * pricePerSeat,
      });
      toast.success("Booking confirmed!", { description: `Reference: ${booking.id}` });
      return booking;
    } catch (err) {
      toast.error((err as Error).message);
      return null;
    }
  };

  return {
    showtime,
    setShowtime,
    selectedSeats,
    bookedSeats,
    toggleSeat,
    name,
    setName,
    email,
    setEmail,
    submit,
  };
}
