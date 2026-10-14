import type { BookingInput } from "./booking-schema";

export type Booking = BookingInput & { id: string; createdAt: string; price: number };
const STORAGE_KEY = "afterglow-bookings";

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Booking[]; } catch { return []; }
}

export function getBooking(id: string) { return getBookings().find((booking) => booking.id === id); }

export function saveBooking(input: BookingInput): Booking {
  const booking: Booking = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), price: 48 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...getBookings()]));
  return booking;
}
