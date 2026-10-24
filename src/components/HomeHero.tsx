"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { useEvents } from "@/lib/useEvents";
import { routes } from "@/lib/routes";
import { shortDate } from "@/lib/format";

export default function HomeHero() {
  const { events } = useEvents();
  const featured = events[0];

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Curated experiences, near you</div>
          <h1>
            Less scrolling.<br />
            <span className="hl">More living.</span>
          </h1>
          <p className="lead">
            Handpicked concerts, workshops, talks, and local gatherings for people who would rather be there than hear about it later.
          </p>

          <form action={routes.events} method="get" className="search-box" role="search">
            <Search size={15} aria-hidden="true" />
            <input name="q" type="search" placeholder="Search events or cities" aria-label="Search events or cities" />
            <button type="submit" className="btn btn-primary">Find events</button>
          </form>

          <div className="stats">
            <div><strong>80+</strong><span>Events monthly</span></div>
            <div><strong>12k</strong><span>Happy guests</span></div>
            <div><strong>20</strong><span>Cities</span></div>
          </div>
        </div>

        {featured && (
          <div className="hero-card">
            <Image src={featured.image} alt={featured.title} fill sizes="(max-width: 900px) 100vw, 400px" />
            <span className="pill">Live this week</span>
            <div className="hero-feature">
              <div>
                <small>EVENT OF THE WEEK</small>
                <strong>{featured.title}</strong>
                <span>{shortDate(featured.date)} · {featured.venue}, {featured.city}</span>
              </div>
              <Link href={routes.eventDetail(featured.slug)} aria-label={`View ${featured.title}`}>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
