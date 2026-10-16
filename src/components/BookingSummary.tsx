import { Calendar, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events";
import { formatPrice, formatTime, shortDate } from "@/lib/format";

export default function BookingSummary({ event, quantity }: { event: EventItem; quantity: number }) {
  return (
    <aside className="summary">
      <img src={event.image} alt={event.title} />
      <p className="cat">{event.category}</p>
      <h3>{event.title}</h3>
      <p className="row"><Calendar size={11} /> {shortDate(event.date)} · {formatTime(event.time)}</p>
      <p className="row"><MapPin size={11} /> {event.venue}, {event.city}</p>
      <div className="total">
        <span>{quantity} {quantity === 1 ? "ticket" : "tickets"}</span>
        <b>{formatPrice(event.price * quantity)}</b>
      </div>
    </aside>
  );
}