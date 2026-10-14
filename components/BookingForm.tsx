"use client";

import { useState } from "react";
import { bookingSchema } from "@/lib/booking-schema";

type Props = {
  availableTickets: number;
  onSubmit: (values: { fullName: string; email: string; quantity: number }) => Promise<void> | void;
  submitting: boolean;
};

export default function BookingForm({ availableTickets, onSubmit, submitting }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = bookingSchema.safeParse({ fullName, email, quantity });
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }
    if (availableTickets <= 0) {
      setErrors({ form: "Sorry, this event is sold out." });
      return;
    }
    if (quantity > availableTickets) {
      setErrors({ quantity: `Only ${availableTickets} tickets are available.` });
      return;
    }
    setErrors({});
    void onSubmit(result.data);
  }

  const fieldClass = "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">Full name</label>
        <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} placeholder="Enter your full name" autoComplete="name" />
        {errors.fullName && <p role="alert" className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email address</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="you@example.com" autoComplete="email" />
        {errors.email && <p role="alert" className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium">Number of tickets</label>
        <select id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={fieldClass} disabled={availableTickets <= 0}>
          {Array.from({ length: Math.min(10, Math.max(1, availableTickets)) }, (_, index) => index + 1).map((number) => (
            <option key={number} value={number}>{number} {number === 1 ? "ticket" : "tickets"}</option>
          ))}
        </select>
        {errors.quantity && <p role="alert" className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
      </div>
      {errors.form && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}
      {availableTickets <= 0 && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">This event is sold out.</p>}
      <button type="submit" disabled={submitting || availableTickets <= 0} className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
        {submitting ? "Confirming booking…" : "Confirm booking"}
      </button>
    </form>
  );
}
