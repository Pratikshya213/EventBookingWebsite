import Link from "next/link";
import type { Booking } from "@/lib/bookings";
import { bookingCode, findEventByTitle, formatPrice, shortDate } from "@/lib/format";

export default function MyBookingCard({ booking }: { booking: Booking }) {
  const event = findEventByTitle(booking.event);
  const tickets = `${booking.tickets} ${booking.tickets === 1 ? "ticket" : "tickets"}`;
  const total = event ? ` · ${formatPrice(event.price * booking.tickets)}` : "";

  return (
    <Link href={`/confirmation?id=${encodeURIComponent(booking.id)}`} className="booking-card">
      {event && <img src={event.image} alt="" />}
      <div>
        <p className="date">{shortDate(booking.date)}</p>
        <h3>{booking.event}</h3>
        <p>{tickets}{total}</p>
        <p className="id">Booking ID: {bookingCode(booking.id)}</p>
      </div>
    </Link>
  );
}