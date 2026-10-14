"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MyBookingCard from "@/components/MyBookingCard";
import { getBookings, type Booking } from "@/lib/bookings";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace(`/login?redirect=${encodeURIComponent("/my-bookings")}`);
      return;
    }
    const timer = window.setTimeout(() => {
      setBookings(getBookings());
      setLoading(false);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-5 py-10 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Your activity</p><h1 className="mt-2 text-3xl font-bold">My bookings</h1><p className="mt-2 text-gray-600">Keep all your upcoming experiences in one place.</p></div>
        <Link href="/events" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">Find events</Link>
      </div>
      <section className="mt-8 space-y-4">
        {loading ? Array.from({ length: 2 }, (_, index) => <div key={index} className="animate-pulse rounded-2xl border border-gray-200 p-5"><div className="h-5 w-1/3 rounded bg-gray-200" /><div className="mt-4 h-4 w-2/3 rounded bg-gray-200" /></div>) : bookings.length ? bookings.map((booking) => <MyBookingCard key={booking.id} booking={booking} /> : (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-14 text-center">
            <div className="text-4xl" aria-hidden="true">🎟️</div><h2 className="mt-4 text-xl font-semibold">No bookings yet</h2><p className="mt-2 text-gray-600">Your booked events will appear here.</p><Link href="/events" className="mt-5 inline-block font-semibold text-indigo-600 hover:underline">Explore events →</Link>
          </div>
        )}
      </section>
    </main>
  );
}
