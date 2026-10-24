import type { Booking } from "@/lib/bookings";
import Image from "next/image";
import { bookingCode, eventFromBooking, formatPrice, formatTime, shortDate } from "@/lib/format";

export default function ConfirmationTicket({ booking }: { booking: Booking }) {
  const info = eventFromBooking(booking);
  const total = info.price !== undefined ? formatPrice(info.price * booking.tickets) : "—";

  return (
    <article className="ticket-card">
      <div className="ticket-top">
        {info.image && <Image src={info.image} alt="" width={48} height={48} />}
        <div>
          <h3>{booking.event}</h3>
          <p className="when">{shortDate(booking.date)}{info.time ? ` · ${formatTime(info.time)}` : ""}</p>
          {info.venue && <p>{info.venue}</p>}
        </div>
      </div>
      <div className="ticket-grid">
        <div><small>Booking ID</small><strong>{bookingCode(booking.id)}</strong></div>
        <div><small>Attendee</small><strong>{booking.name}</strong></div>
        <div><small>Tickets</small><strong>{booking.tickets}</strong></div>
        <div><small>Total</small><strong>{total}</strong></div>
      </div>
    </article>
  );
}
