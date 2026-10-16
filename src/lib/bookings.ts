export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  event: string;
  date: string;
  tickets: number;
};

const STORAGE_KEY = "afterglow-bookings";

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? (value as Booking[]) : [];
  } catch {
    return [];
  }
}

export function getBookingById(id: string) {
  return getBookings().find((booking) => booking.id === id);
}

export function saveBooking(input: Omit<Booking, "id" | "createdAt">): Booking {
  const booking = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...getBookings()]));
  return booking;
}
