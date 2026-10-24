import axios from "axios";
import api from "./axios";
import type { EventItem } from "./events";
import type { Booking } from "./bookings";

export type EventInput = Omit<EventItem, "id">;

export async function listEvents() {
  const response = await api.get<EventItem[]>("/events");
  return response.data;
}

export async function listBookings() {
  try {
    const response = await api.get<Booking[]>("/bookings");
    return response.data;
  } catch (error) {
    // Older db.json files have no "bookings" list yet
    if (axios.isAxiosError(error) && error.response?.status === 404) return [];
    throw error;
  }
}

export async function createEvent(input: EventInput) {
  const response = await api.post<EventItem>("/events", input);
  return response.data;
}

export async function updateEvent(id: string, input: EventInput) {
  const response = await api.patch<EventItem>(`/events/${encodeURIComponent(id)}`, input);
  return response.data;
}

export async function deleteEvent(id: string) {
  await api.delete(`/events/${encodeURIComponent(id)}`);
}

/** Uploads an image from the admin's device and returns the URL to store on the event. */
export async function uploadEventImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch("/api/uploads", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Image upload failed.");
  }
  return data.url;
}
