"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { z } from "zod";
import { createEvent, updateEvent, uploadEventImage, type EventInput } from "../../lib/admin";
import type { EventItem } from "@/lib/events";

const CATEGORIES = ["Music", "Arts", "Business", "Food"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

const numberField = (label: string, whole = false) =>
  z
    .string()
    .trim()
    .min(1, `Enter ${label}`)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, `${label} must be 0 or more`)
    .refine((v) => !whole || Number.isInteger(Number(v)), `${label} must be a whole number`);

const eventSchema = z.object({
  title: z.string().trim().min(3, "Enter the event title"),
  category: z.string().min(1, "Choose a category"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
  venue: z.string().trim().min(2, "Enter the venue"),
  city: z.string().trim().min(2, "Enter the city"),
  price: numberField("a price"),
  availableTickets: numberField("the number of tickets", true),
  description: z.string().trim().min(10, "Add a short description (at least 10 characters)"),
});

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "event";
}

type Props = {
  initial?: EventItem;
  onSaved: (event: EventItem) => void;
  onCancel: () => void;
};

export default function AdminEventForm({ initial, onSaved, onCancel }: Props) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? CATEGORIES[0],
    date: initial?.date ?? "",
    time: initial?.time ?? "",
    venue: initial?.venue ?? "",
    city: initial?.city ?? "",
    price: initial ? String(initial.price) : "",
    availableTickets: initial ? String(initial.availableTickets) : "",
    description: initial?.description ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  // Free the temporary preview URL when it changes or the form closes
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0];
    if (!chosen) return;
    if (!IMAGE_TYPES.includes(chosen.type)) {
      setErrors((e) => ({ ...e, image: "Use a JPG, PNG, WebP, GIF or AVIF image." }));
      return;
    }
    if (chosen.size > MAX_IMAGE_BYTES) {
      setErrors((e) => ({ ...e, image: "Image is too large (max 5 MB)." }));
      return;
    }
    setErrors((e) => ({ ...e, image: "" }));
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  function clearImage() {
    setFile(null);
    setPreview(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    const result = eventSchema.safeParse(values);
    const nextErrors: Record<string, string> = {};
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      });
    }
    if (!file && !preview) nextErrors.image = "Choose an image from your device";

    if (!result.success || nextErrors.image) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    try {
      setSaving(true);
      const image = file ? await uploadEventImage(file) : (initial?.image as string);
      const data = result.data;
      const payload: EventInput = {
        slug: initial?.slug ?? `${slugify(data.title)}-${Math.random().toString(36).slice(2, 6)}`,
        title: data.title,
        category: data.category,
        date: data.date,
        time: data.time,
        venue: data.venue,
        city: data.city,
        price: Number(data.price),
        availableTickets: Number(data.availableTickets),
        description: data.description,
        image,
      };
      const saved = initial ? await updateEvent(initial.id, payload) : await createEvent(payload);
      onSaved(saved);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Could not save the event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form-head">
        <h2>{initial ? "Edit event" : "Add a new event"}</h2>
        <button type="button" className="icon-btn" aria-label="Close form" onClick={onCancel}><X size={16} /></button>
      </div>

      <div className="admin-image-field">
        <span className="label">Event image</span>
        <div className="admin-image-row">
          <div className="admin-image-preview">
            {preview ? <Image src={preview} alt="Event preview" width={120} height={80} unoptimized={preview.startsWith("blob:")} /> : <span><ImagePlus size={22} /></span>}
          </div>
          <div>
            <label className="btn btn-outline" htmlFor="event-image">{preview ? "Change image" : "Choose image"}</label>
            <input id="event-image" type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            {preview && <button type="button" className="link-plain admin-remove" onClick={clearImage}>Remove</button>}
            <p className="hint">JPG, PNG, WebP, GIF or AVIF · up to 5 MB</p>
            {errors.image && <p role="alert" className="field-err">{errors.image}</p>}
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="field admin-span-2">
          <label htmlFor="title">Event title</label>
          <input id="title" className="input" value={values.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Kathmandu Music Festival" />
          {errors.title && <p role="alert" className="field-err">{errors.title}</p>}
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" className="input" value={values.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p role="alert" className="field-err">{errors.category}</p>}
        </div>

        <div className="field">
          <label htmlFor="price">Ticket price (Rs.)</label>
          <input id="price" type="number" min="0" step="1" className="input" value={values.price} onChange={(e) => set("price", e.target.value)} placeholder="0 for free" />
          {errors.price && <p role="alert" className="field-err">{errors.price}</p>}
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" className="input" value={values.date} onChange={(e) => set("date", e.target.value)} />
          {errors.date && <p role="alert" className="field-err">{errors.date}</p>}
        </div>

        <div className="field">
          <label htmlFor="time">Time</label>
          <input id="time" type="time" className="input" value={values.time} onChange={(e) => set("time", e.target.value)} />
          {errors.time && <p role="alert" className="field-err">{errors.time}</p>}
        </div>

        <div className="field">
          <label htmlFor="venue">Venue</label>
          <input id="venue" className="input" value={values.venue} onChange={(e) => set("venue", e.target.value)} placeholder="e.g. Bhrikutimandap" />
          {errors.venue && <p role="alert" className="field-err">{errors.venue}</p>}
        </div>

        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" className="input" value={values.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Kathmandu" />
          {errors.city && <p role="alert" className="field-err">{errors.city}</p>}
        </div>

        <div className="field">
          <label htmlFor="availableTickets">Available tickets</label>
          <input id="availableTickets" type="number" min="0" step="1" className="input" value={values.availableTickets} onChange={(e) => set("availableTickets", e.target.value)} placeholder="e.g. 100" />
          {errors.availableTickets && <p role="alert" className="field-err">{errors.availableTickets}</p>}
        </div>

        <div className="field admin-span-2">
          <label htmlFor="description">Description</label>
          <textarea id="description" className="input admin-textarea" value={values.description} onChange={(e) => set("description", e.target.value)} placeholder="What should people know about this event?" />
          {errors.description && <p role="alert" className="field-err">{errors.description}</p>}
        </div>
      </div>

      {serverError && <p role="alert" className="form-alert">{serverError}</p>}

      <div className="admin-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save changes" : "Add event"}
        </button>
      </div>
    </form>
  );
}
