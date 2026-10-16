import type { Booking } from "@/lib/bookings";
import { bookingCode, findEventByTitle, formatPrice, formatTime, shortDate } from "@/lib/format";

export default function ConfirmationTicket({ booking }: { booking: Booking }) {
  const event = findEventByTitle(booking.event);
  const total = event ? formatPrice(event.price * booking.tickets) : "—";

  return (
    <article className="ticket-card">
      <div className="ticket-top">
        {event && <img src={event.image} alt="" />}
        <div>
          <h3>{booking.event}</h3>
          <p className="when">{shortDate(booking.date)}{event ? ` · ${formatTime(event.time)}` : ""}</p>
          {event && <p>{event.venue}</p>}
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