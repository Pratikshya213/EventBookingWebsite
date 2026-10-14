"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import BookingSummary from "@/components/BookingSummary";
import { events } from "@/lib/events";
import { saveBooking } from "@/lib/bookings";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("event") ?? events[0]?.slug;
  const event = events.find((item) => item.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // Temporary demo guard. Replace this key with Person B's AuthContext.
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(`/booking?event=${slug}`)}`);
    } else {
      setCheckedAuth(true);
    }
  }, [router, slug]);

  const safeQuantity = useMemo(() => Math.min(quantity, event?.availableTickets ?? 0), [quantity, event]);

  async function handleBooking(values: { fullName: string; email: string; quantity: number }) {
    if (!event || event.availableTickets <= 0) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    const bookingId = `EB-${Date.now().toString(36).toUpperCase()}`;
    saveBooking({
      id: bookingId,
      eventId: event.id,
      eventSlug: event.slug,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      venue: event.venue,
      city: event.city,
      image: event.image,
      attendeeName: values.fullName,
      attendeeEmail: values.email,
      quantity: values.quantity,
      unitPrice: event.price,
      totalPrice: event.price * values.quantity,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    });
    router.push(`/confirmation?id=${encodeURIComponent(bookingId)}`);
  }

  if (!checkedAuth) return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-gray-600">Checking your account…</div>;
  if (!event) return <main className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-2xl font-bold">Event not found</h1><Link className="mt-4 inline-block text-indigo-600" href="/events">Browse events</Link></main>;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
      <Link href={`/events/${event.slug}`} className="text-sm font-medium text-indigo-600 hover:underline">← Back to event</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Secure your place</p>
          <h1 className="mt-2 text-3xl font-bold">Complete your booking</h1>
          <p className="mt-2 text-gray-600">{event.title}</p>
          <div className="mt-7"><BookingForm availableTickets={event.availableTickets} submitting={submitting} onSubmit={handleBooking} /></div>
        </section>
        <div className="space-y-5">
          <img src={event.image} alt={event.title} className="h-48 w-full rounded-2xl object-cover" />
          <BookingSummary title={event.title} unitPrice={event.price} quantity={safeQuantity} />
          <p className="text-xs text-gray-500">Demo checkout only. This project does not process payments.</p>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return <Suspense fallback={<div className="px-5 py-20 text-center">Loading booking…</div>}><BookingContent /></Suspense>;
}
