export type Booking = {
  id: string;
  // The ticket ID the guest sees. The backend makes up its own `id`, so it keeps this one separately.
  bookingId?: string;
  createdAt: string;
  name: string;
  email: string;
  event: string;
  date: string;
  tickets: number;
  // Snapshot of the event at booking time (so tickets still look right if the event is edited or deleted)
  eventId?: string;
  image?: string;
  venue?: string;
  time?: string;
  price?: number;
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

export async function saveBooking(input: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
  const booking: Booking = { ...input, id: `booking-${Date.now()}`, createdAt: new Date().toISOString() };
  if (typeof window === "undefined") throw new Error("Bookings can only be saved in a browser.");
  localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...getBookings()]));
  return booking;
}
