import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import type { EventItem } from "@/lib/events";
import { formatPrice, formatTime, shortDate } from "@/lib/format";

export default function BookingSummary({ event, quantity }: { event: EventItem; quantity: number }) {
  return (
    <aside className="summary">
      <Image src={event.image} alt={event.title} width={600} height={126} sizes="(max-width: 768px) 100vw, 300px" />
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
