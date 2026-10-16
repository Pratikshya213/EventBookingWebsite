"use client";

import { useEffect, useMemo, useState } from "react";
import HeroSection from "./HeroSection";
import EventCard from "./EventCard";
import SearchBar from "./SearchBar";

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
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/events", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const data: Event[] = await response.json();
        setEvents(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Unable to load events. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(events.map((event) => event.category))],
    [events],
  );

  const filteredEvents = useMemo(() => {
    const result = events.filter((event) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        event.title.toLowerCase().includes(searchText) ||
        event.location.toLowerCase().includes(searchText) ||
        event.category.toLowerCase().includes(searchText);

      const matchesCategory = category === "All" || event.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [events, search, category, sortBy]);

  return (
    <main className="min-h-screen bg-[#fff8eb]">
      <HeroSection />

      <section className="px-4 pt-3 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Search, category filter and sorting */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <SearchBar
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#452b2e]">
              Upcoming Events
            </h2>

            <p className="text-sm text-[#805c58]">
              {filteredEvents.length} events found
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#805c58]">
              Loading events...
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="mb-4 text-[#805c58]">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-[#e76f61] px-5 py-2.5 font-semibold text-white hover:bg-[#d95d50]"
              >
                Try again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-[#e5dedc] bg-white px-5 py-16 text-center">
              <h3 className="text-lg font-semibold text-[#452b2e]">
                No events found
              </h3>
              <p className="mt-2 text-sm text-[#805c58]">
                Try another search or category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setSortBy("default");
                }}
                className="mt-4 font-semibold text-[#e76f61] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
