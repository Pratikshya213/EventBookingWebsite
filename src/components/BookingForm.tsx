"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { bookingSchema } from "@/lib/booking-schema";
import { formatPrice } from "@/lib/format";

const MAX_PER_BOOKING = 10;

type Props = {
  availableTickets: number;
  price: number;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onSubmit: (values: { fullName: string; email: string; quantity: number }) => Promise<void> | void;
  submitting: boolean;
  error?: string;
};

export default function BookingForm({ availableTickets, price, quantity, onQuantityChange, onSubmit, submitting, error }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const max = Math.min(MAX_PER_BOOKING, Math.max(1, availableTickets));
  const soldOut = availableTickets <= 0;

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
    if (soldOut) {
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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-row">
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" autoComplete="name" />
          {errors.fullName && <p role="alert" className="field-err">{errors.fullName}</p>}
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          {errors.email && <p role="alert" className="field-err">{errors.email}</p>}
        </div>
      </div>

      <div className="field">
        <span className="label" id="qty-label">Number of tickets</span>
        <div className="stepper" role="group" aria-labelledby="qty-label">
          <button type="button" aria-label="Remove one ticket" disabled={soldOut || quantity <= 1} onClick={() => onQuantityChange(quantity - 1)}><Minus size={12} /></button>
          <output aria-live="polite">{quantity}</output>
          <button type="button" aria-label="Add one ticket" disabled={soldOut || quantity >= max} onClick={() => onQuantityChange(quantity + 1)}><Plus size={12} /></button>
        </div>
        {errors.quantity && <p role="alert" className="field-err">{errors.quantity}</p>}
      </div>
      <p className="hint">Maximum {MAX_PER_BOOKING} tickets per booking.</p>

      {errors.form && <p role="alert" className="form-alert">{errors.form}</p>}
      {error && <p role="alert" className="form-alert">{error}</p>}
      {soldOut && <p className="form-alert">This event is sold out.</p>}

      <button type="submit" disabled={submitting || soldOut} className="btn btn-primary btn-block btn-lg">
        {submitting ? "Confirming booking…" : `Confirm booking · ${formatPrice(price * quantity)}`}
      </button>
    </form>
  );
}
