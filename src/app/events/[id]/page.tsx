"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useEvents } from "@/lib/useEvents";
import { routes } from "@/lib/routes";
import { formatPrice, formatTime, shortDate } from "@/lib/format";

function EventDetails() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const { events, loading } = useEvents();
  const event = events.find((item) => item.slug === id || item.id === id);

  if (loading) {
    return (
      <main className="page">
        <div className="container container-md"><div className="skeleton skeleton-card" /></div>
      </main>
    );
  }

  if (!event) notFound();

  return (
    <main className="page">
      <div className="container container-md">
        <Link href={routes.events} className="back-link"><ArrowLeft size={12} /> Browse events</Link>
        <section className="panel">
          <Image src={event.image} alt={event.title} width={1200} height={675} sizes="(max-width: 768px) 100vw, 800px" className="summary-image" />
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

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<main className="page"><div className="container container-md"><div className="skeleton skeleton-card" /></div></main>}>
      <EventDetails />
    </Suspense>
  );
}
