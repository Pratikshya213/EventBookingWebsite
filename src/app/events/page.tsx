import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { events } from "@/lib/events";
import { routes } from "@/lib/routes";
import { formatPrice, splitDate } from "@/lib/format";

export default function EventsPage() {
  return (
    <main className="page">
      <div className="container">
        <div className="eyebrow">Find your next plan</div>
        <h1 className="page-title">Browse events</h1>
        <div className="event-grid">
          {events.map((event) => {
            const { month, day } = splitDate(event.date);

            return (
              <Link key={event.id} href={routes.eventDetail(event.slug)} className="event-card">
                <div className="event-media">
                  <img src={event.image} alt={event.title} />
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
      </div>
    </main>
  );
}
