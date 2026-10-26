"use client";

import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import EventList from "./EventList";

type Event = {
  id: string | number;
  title: string;
  category: string;
  image: string;
  date: string;
  day: string;
  location: string;
  price: number;
};

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function getEvents() {
      try {
        const res = await fetch("http://localhost:5000/events", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Could not fetch events");
        }

        const data: Event[] = await res.json();
        setEvents(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching events:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getEvents();

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-[#fff8eb]">
      <HeroSection />

      {loading ? (
        <p className="py-12 text-center text-[#805c58]">Loading events...</p>
      ) : (
        <EventList events={events} />
      )}
    </div>
  );
}
