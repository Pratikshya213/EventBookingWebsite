import Link from "next/link";
import Image from "next/image";
import type { Booking } from "@/lib/bookings";
import { bookingCode, eventFromBooking, formatPrice, shortDate } from "@/lib/format";

export default function MyBookingCard({ booking }: { booking: Booking }) {
  const info = eventFromBooking(booking);
  const tickets = `${booking.tickets} ${booking.tickets === 1 ? "ticket" : "tickets"}`;
  const total = info.price !== undefined ? ` · ${formatPrice(info.price * booking.tickets)}` : "";

  return (
    <Link href={`/confirmation?id=${encodeURIComponent(booking.id)}`} className="booking-card">
      {info.image && <Image src={info.image} alt="" width={92} height={74} />}
      <div>
        <p className="date">{shortDate(booking.date)}</p>
        <h3>{booking.event}</h3>
        <p>{tickets}{total}</p>
        <p className="id">Booking ID: {bookingCode(booking.id)}</p>
      </div>
    </Link>
  );
}
