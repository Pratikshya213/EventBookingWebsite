"use client";

import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import EventCard from "./EventCard";

export type EventCardData = {
  id: string | number;
  slug?: string;
  title: string;
  category: string;
  image: string;
  date: string;
  day: string;
  location: string;
  price: number;
};

type EventListProps = {
  events: EventCardData[];
};

export default function EventList({ events }: EventListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("LowToHigh");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        event.category.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sortBy === "LowToHigh") {
        return a.price - b.price;
      }

      if (sortBy === "HighToLow") {
        return b.price - a.price;
      }

      if (sortBy === "A-Z") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });
  }, [events, search, category, sortBy]);

  return (
    <>
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        {filteredEvents.length > 0 ? (
          <>
            <p className="mx-auto mb-6 max-w-7xl text-sm text-[#805c58]">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </p>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <p className="py-12 text-center text-[#805c58]">
            No events found. Try another search or category.
          </p>
        )}
      </section>
    </>
  );
}
