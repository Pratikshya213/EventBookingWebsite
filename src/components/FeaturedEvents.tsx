import Link from "next/link";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { events } from "@/lib/events";
import { routes } from "@/lib/routes";
import { splitDate, formatPrice } from "@/lib/format";

export default function FeaturedEvents() {
  return (
    <section className="featured" id="discover">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Handpicked for you</div>
            <h2>Featured events</h2>
          </div>
          <Link href={routes.events} className="section-link">See everything <ArrowRight size={13} /></Link>
        </div>

        <div className="event-grid">
          {events.slice(0, 3).map((event) => {
            const { month, day } = splitDate(event.date);
            return (
              <Link key={event.id} href={routes.eventDetail(event.slug)} className="event-card">
                <div className="event-media">
                  <img src={event.image} alt={event.title} />
                  <span className="pill">{event.category}</span>
                  <span className="heart" aria-hidden="true"><Heart size={13} /></span>
                </div>
                <div className="event-body">
                  <div className="event-date"><small>{month}</small><b>{day}</b></div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-loc"><MapPin size={11} />{event.venue}, {event.city}</p>
                    <div className="event-foot">
                      <span>{event.availableTickets <= 0 ? "Sold out" : `From ${formatPrice(event.price)}`}</span>
                      <span className="arrow-btn"><ArrowRight size={11} /></span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}