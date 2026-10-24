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
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({})) as Booking & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Booking could not be completed.");
  const booking = { ...data, id: data.bookingId ?? data.id };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...getBookings()]));
  }
  return booking;
}
