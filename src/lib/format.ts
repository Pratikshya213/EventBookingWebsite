import { events, type EventItem } from "@/lib/events";
import type { Booking } from "@/lib/bookings";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** "2026-11-14" -> { month: "NOV", day: "14" } (no timezone surprises) */
export function splitDate(iso: string) {
  const [, m, d] = iso.split("-");
  return { month: MONTHS[Number(m) - 1] ?? "", day: String(Number(d)) };
}

/** "2026-11-14" -> "NOV 14" */
export function shortDate(iso: string) {
  const { month, day } = splitDate(iso);
  return `${month} ${day}`;
}

/** "2026-11-14" -> "NOV 14, 2026" */
export function longDate(iso: string) {
  return `${shortDate(iso)}, ${iso.split("-")[0]}`;
}

/** "17:00" -> "5:00 PM" */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatPrice(price: number) {
  return price === 0 ? "Free" : `Rs. ${price.toLocaleString("en-US")}`;
}

export function bookingCode(id: string) {
  return `HAP-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

/** Looks an event up by title in the starter events (used for old bookings that have no snapshot). */
export function findEventByTitle(title: string): EventItem | undefined {
  return events.find((e) => e.title === title);
}

export type BookingEventInfo = {
  image?: string;
  price?: number;
  venue?: string;
  time?: string;
};

/** Event details for a booking: uses the snapshot saved with the booking, or the starter events for old bookings. */
export function eventFromBooking(booking: Booking): BookingEventInfo {
  const seed = findEventByTitle(booking.event);
  return {
    image: booking.image ?? seed?.image,
    price: booking.price ?? seed?.price,
    venue: booking.venue ?? seed?.venue,
    time: booking.time ?? seed?.time,
  };
}