import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { events } from "@/lib/events";
import { routes } from "@/lib/routes";
import { formatPrice, formatTime, shortDate } from "@/lib/format";

export function generateStaticParams() {
  return events.map((event) => ({ id: event.slug }));
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = events.find((item) => item.slug === id || item.id === id);

  if (!event) notFound();

  return (
    <main className="page">
      <div className="container container-md">
        <Link href={routes.events} className="back-link"><ArrowLeft size={12} /> Browse events</Link>
        <section className="panel">
          <img src={event.image} alt={event.title} className="summary-image" />
          <div className="eyebrow">{event.category}</div>
          <h1 className="page-title">{event.title}</h1>
          <p>{event.description}</p>
          <p className="row"><Calendar size={14} /> {shortDate(event.date)} · {formatTime(event.time)}</p>
          <p className="row"><MapPin size={14} /> {event.venue}, {event.city}</p>
          <p className="row">{event.availableTickets > 0 ? `${event.availableTickets} tickets available` : "Sold out"}</p>
          <p className="row">{formatPrice(event.price)} per ticket</p>
          <Link className="btn btn-primary" href={`${routes.booking}?event=${encodeURIComponent(event.slug)}`}>
            {event.availableTickets > 0 ? "Book tickets" : "See booking options"}
          </Link>
        </section>
      </div>
    </main>
  );
}
