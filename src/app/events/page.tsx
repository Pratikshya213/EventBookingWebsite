"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { useEvents } from "@/lib/useEvents";
import { routes } from "@/lib/routes";
import { formatPrice, splitDate } from "@/lib/format";

export default function EventsPage() {
  const { events, loading } = useEvents();

  return (
    <main className="page">
      <div className="container">
        <div className="eyebrow">Find your next plan</div>
        <h1 className="page-title">Browse events</h1>

        {loading ? (
          <div className="event-grid">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton skeleton-card" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="empty">
            <h2>No events yet</h2>
            <p>Check back soon - new events are added all the time.</p>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((event) => {
              const { month, day } = splitDate(event.date);

              return (
                <Link key={event.id} href={routes.eventDetail(event.slug)} className="event-card">
                  <div className="event-media">
                    <Image src={event.image} alt={event.title} width={1200} height={675} sizes="(max-width: 768px) 100vw, 33vw" />
                    <span className="pill">{event.category}</span>
                  </div>
                  <div className="event-body">
                    <div className="event-date"><small>{month}</small><b>{day}</b></div>
                    <div className="event-info">
                      <h2>{event.title}</h2>
                      <p className="event-loc"><MapPin size={11} />{event.venue}, {event.city}</p>
                      <div className="event-foot">
                        <span>{event.availableTickets <= 0 ? "Sold out" : "From " + formatPrice(event.price)}</span>
                        <span className="arrow-btn"><ArrowRight size={11} /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
