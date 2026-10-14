"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmationTicket from "@/components/ConfirmationTicket";
import { getBookingById, type Booking } from "@/lib/bookings";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.replace(`/login?redirect=${encodeURIComponent(`/confirmation?id=${searchParams.get("id") ?? ""}`)}`);
      return;
    }
    const id = searchParams.get("id");
    setBooking(id ? getBookingById(id) ?? null : null);
    setChecked(true);
  }, [router, searchParams]);

  if (!checked) return <div className="px-5 py-20 text-center text-gray-600">Loading your ticket…</div>;
  if (!booking) return <main className="mx-auto max-w-2xl px-5 py-20 text-center"><h1 className="text-2xl font-bold">Booking not found</h1><p className="mt-2 text-gray-600">Please open a valid confirmation link or check My Bookings.</p><Link href="/my-bookings" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">My Bookings</Link></main>;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <div className="mb-6 text-center"><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">You're all set</p><h1 className="mt-2 text-3xl font-bold">Your ticket</h1></div>
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500"><ConfirmationTicket booking={booking} /></div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/my-bookings" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">View my bookings</Link>
        <Link href="/events" className="rounded-xl border border-gray-300 px-5 py-3 font-semibold transition hover:bg-gray-50">Discover more events</Link>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return <Suspense fallback={<div className="px-5 py-20 text-center">Loading confirmation…</div>}><ConfirmationContent /></Suspense>;
}
