import type { Booking } from "@/lib/bookings";
import { bookingCode, eventFromBooking, formatPrice, longDate } from "@/lib/format";

export default function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return <div className="empty"><h2>No bookings yet</h2><p>Bookings made on the site will show up here.</p></div>;
  }

  const sorted = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Guest</th>
            <th>Event</th>
            <th>Event date</th>
            <th>Tickets</th>
            <th>Total</th>
            <th>Booked on</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((booking) => {
            const info = eventFromBooking(booking);
            return (
              <tr key={booking.id}>
                <td><strong>{bookingCode(booking.bookingId ?? booking.id)}</strong></td>
                <td>{booking.name}<br /><span className="muted">{booking.email}</span></td>
                <td>{booking.event}</td>
                <td>{longDate(booking.date)}</td>
                <td>{booking.tickets}</td>
                <td>{info.price !== undefined ? formatPrice(info.price * booking.tickets) : "—"}</td>
                <td>{new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}