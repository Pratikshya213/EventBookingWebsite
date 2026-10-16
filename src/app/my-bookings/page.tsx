"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MyBookingCard from "@/components/MyBookingCard";
import { getBookings, type Booking } from "@/lib/bookings";
import { routes } from "@/lib/routes";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBookings(getBookings());
      setLoading(false);
    }, 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="page">
      <div className="container container-sm">
        <div className="eyebrow">Your plans</div>
        <h1 className="page-title">My bookings</h1>

        {loading ? (
          <div className="booking-list">
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ) : bookings.length ? (
          <div className="booking-list">
            {bookings.map((booking) => <MyBookingCard key={booking.id} booking={booking} />)}
          </div>
        ) : (
          <div className="empty">
            <h2>No bookings yet</h2>
            <p>When you book an event, it will appear here.</p>
            <Link href={routes.events} className="btn btn-primary">Find an event</Link>
          </div>
        )}
      </div>
    </main>
  );
}