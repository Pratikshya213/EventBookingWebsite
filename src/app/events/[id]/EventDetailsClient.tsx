"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEvents } from "@/lib/useEvents";
import { formatTime } from "@/lib/format";

function EventDetails() {
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const id = decodeURIComponent(params?.id ?? searchParams.get("id") ?? "");
  const { events, loading } = useEvents();
  const event = events.find((item) => item.slug === id || item.id === id);

  if (loading) {
    return <main className="min-h-screen bg-[#fff8eb] px-4 py-7 sm:px-6 sm:py-10"><div className="mx-auto max-w-5xl"><div className="skeleton skeleton-card" /></div></main>;
  }

  if (!event) {
    return <main className="min-h-screen bg-[#fff8eb] px-4 py-7 sm:px-6 sm:py-10"><div className="mx-auto max-w-5xl"><Link href="/events" className="text-sm text-[#805c58]">← Back to events</Link><h1 className="mt-8 text-3xl font-bold text-[#452b2e]">Event not found</h1><p className="mt-3 text-[#805c58]">This event may have been removed.</p></div></main>;
  }

  const soldOut = event.availableTickets <= 0;
  const [, month, day] = event.date.split("-");
  const dateLabel = new Date(Date.UTC(Number(event.date.slice(0, 4)), Number(month) - 1, Number(day)))
    .toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });

  return (
    <main className="min-h-screen bg-[#fff8eb] px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/events" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#805c58] transition hover:text-[#e76f61]">
          <span aria-hidden="true">←</span> Back to events
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#e5dedc] bg-white shadow-sm">
          <div className="relative h-[210px] w-full overflow-hidden bg-[#f1e8df] sm:h-[280px] lg:h-[340px]">
            <Image src={event.image} alt={event.title} fill priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px" className="object-cover object-center" />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#452b2e] shadow-sm">{event.category}</span>
            {soldOut && <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Sold out</span>}
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_260px] lg:gap-8">
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e76f61]">Discover your next experience</p>
              <h1 className="mb-3 text-2xl font-bold leading-tight text-[#452b2e] sm:text-3xl">{event.title}</h1>
              <p className="mb-5 text-sm leading-7 text-[#805c58] sm:text-base">{event.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#fff8eb] p-4"><p className="mb-1 text-xs font-medium text-[#805c58]">Date</p><p className="text-sm font-bold text-[#452b2e]">{dateLabel} {Number(day)}</p></div>
                <div className="rounded-xl bg-[#fff8eb] p-4"><p className="mb-1 text-xs font-medium text-[#805c58]">Time</p><p className="text-sm font-bold text-[#452b2e]">{formatTime(event.time)}</p></div>
                <div className="rounded-xl bg-[#fff8eb] p-4 sm:col-span-2"><p className="mb-1 text-xs font-medium text-[#805c58]">Venue</p><p className="text-sm font-bold text-[#452b2e]">{event.venue}</p><p className="mt-1 text-xs text-[#805c58]">{event.city}</p></div>
              </div>
            </section>

            <aside className="h-fit rounded-xl border border-[#e5dedc] p-5">
              <p className="mb-1 text-sm text-[#805c58]">Ticket price</p>
              <p className="mb-1 text-3xl font-bold text-[#452b2e]">{event.price === 0 ? "Free" : `$${event.price.toLocaleString("en-US")}`}</p>
              <p className="mb-5 text-xs text-[#805c58]">Per ticket</p>
              {soldOut ? (
                <button type="button" disabled className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 text-sm font-semibold text-gray-600">Sold out</button>
              ) : (
                <Link href={`/booking?event=${encodeURIComponent(event.slug)}`} className="block w-full rounded-lg bg-[#e76f61] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#d95d50]">Book Now</Link>
              )}
              <p className="mt-3 text-center text-xs leading-5 text-[#805c58]">{soldOut ? "Tickets are no longer available for this event." : "Your next great experience starts here."}</p>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function EventDetailsClient() {
  return <Suspense fallback={<main className="min-h-screen bg-[#fff8eb] px-4 py-7 sm:px-6 sm:py-10"><div className="mx-auto max-w-5xl"><div className="skeleton skeleton-card" /></div></main>}><EventDetails /></Suspense>;
}
