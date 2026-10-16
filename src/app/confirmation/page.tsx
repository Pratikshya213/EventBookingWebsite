"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ConfirmationTicket from "@/components/ConfirmationTicket";
import { getBookingById, type Booking } from "@/lib/bookings";
import { routes } from "@/lib/routes";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    const timer = window.setTimeout(() => {
      setBooking(id ? getBookingById(id) ?? null : null);
      setChecked(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  if (!checked) {
    return <main className="page"><div className="container container-xs"><div className="skeleton" /></div></main>;
  }

  if (!booking) {
    return (
      <main className="nf">
        <div>
          <div className="eyebrow">Booking not found</div>
          <h1>Hmm.</h1>
          <p>Please open a valid confirmation link or check My bookings.</p>
          <Link href={routes.myBookings} className="btn btn-primary">My bookings</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container container-xs confirm">
        <div className="confirm-check" aria-hidden="true">✓</div>
        <div className="eyebrow" style={{ justifyContent: "center", marginTop: 0 }}>Booking confirmed</div>
        <h1>You&rsquo;re going to {booking.event}</h1>
        <p className="sub">We&rsquo;ve saved your booking and sent the details to {booking.email}.</p>

        <ConfirmationTicket booking={booking} />

        <div className="confirm-actions">
          <Link href={routes.myBookings} className="btn btn-primary">View my bookings</Link>
          <Link href={routes.events} className="btn btn-outline">Explore more events</Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<main className="page"><div className="container container-xs"><div className="skeleton" /></div></main>}>
      <ConfirmationContent />
    </Suspense>
  );
}