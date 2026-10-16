"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import BookingSummary from "@/components/BookingSummary";
import { useEvents } from "@/lib/useEvents";
import { saveBooking } from "@/lib/bookings";
import { routes } from "@/lib/routes";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { events, loading, error: eventsError } = useEvents();
  const slug = searchParams.get("event") ?? events[0]?.slug;
  const event = events.find((item) => item.slug === slug);
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookingError, setBookingError] = useState("");

  async function handleBooking(values: { fullName: string; email: string; quantity: number }) {
    if (!event || event.availableTickets <= 0) return;
    setSubmitting(true);
    setBookingError("");
    try {
    const booking = await saveBooking({
      name: values.fullName,
      email: values.email,
      event: event.title,
      date: event.date,
      tickets: values.quantity,
      eventId: event.id,
      image: event.image,
      venue: event.venue,
      time: event.time,
      price: event.price,
    });
    router.push(`/confirmation?id=${encodeURIComponent(booking.id)}`);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Booking could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="page"><div className="container container-md"><div className="skeleton skeleton-card" /></div></main>;
  }

  if (eventsError) {
    return (
      <main className="nf">
        <div>
          <div className="eyebrow">Booking service unavailable</div>
          <h1>We couldn&apos;t load this event</h1>
          <p role="alert">{eventsError}</p>
          <Link className="btn btn-primary" href={routes.events}>Try again</Link>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="nf">
        <div>
          <div className="eyebrow">Event not found</div>
          <h1>Oops</h1>
          <p>We couldn&apos;t find that event.</p>
          <Link className="btn btn-primary" href={routes.events}>Browse events</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container container-md">
        <Link href={routes.eventDetail(event.slug)} className="back-link"><ArrowLeft size={12} /> Back to event</Link>
        <div className="eyebrow">Complete your booking</div>
        <h1 className="page-title">Your details</h1>

        <div className="booking-grid">
          <section className="panel">
            <BookingForm
              availableTickets={event.availableTickets}
              price={event.price}
              quantity={quantity}
              onQuantityChange={setQuantity}
              submitting={submitting}
              error={bookingError}
              onSubmit={handleBooking}
            />
          </section>
          <BookingSummary event={event} quantity={quantity} />
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<main className="page"><div className="container container-md"><div className="skeleton skeleton-card" /></div></main>}>
      <BookingContent />
    </Suspense>
  );
}
