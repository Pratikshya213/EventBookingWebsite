"use client";

import EventList, { type EventCardData } from "./EventList";
import HeroSection from "./HeroSection";
import { useEvents } from "@/lib/useEvents";
import { splitDate } from "@/lib/format";

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const cards: EventCardData[] = events.map((event) => {
    const { month, day } = splitDate(event.date);
    return {
      id: event.id,
      slug: event.slug,
      title: event.title,
      category: event.category,
      image: event.image,
      date: month,
      day,
      location: [event.venue, event.city].filter(Boolean).join(", "),
      price: event.price,
    };
  });

  return (
    <main className="min-h-screen bg-[#fff8eb]">
      <HeroSection />
      {loading ? (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="skeleton skeleton-card" />)}
        </div>
      ) : error ? (
        <p className="form-alert mx-5 my-8" role="alert">{error}</p>
      ) : (
        <EventList events={cards} />
      )}
    </main>
  );
}
