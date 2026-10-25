import { deleteLocalEvent, fetchEvents, saveLocalEvent, type EventItem } from "./events";
import { getBookings } from "./bookings";

export type EventInput = Omit<EventItem, "id">;

export async function listEvents() {
  return fetchEvents();
}

export async function listBookings() {
  return getBookings();
}

export async function createEvent(input: EventInput) {
  return saveLocalEvent(input);
}

export async function updateEvent(id: string, input: EventInput) {
  return saveLocalEvent(input, id);
}

export async function deleteEvent(id: string) {
  deleteLocalEvent(id);
}

/** Uploads an image from the admin's device and returns the URL to store on the event. */
export async function uploadEventImage(file: File): Promise<string> {
  if (file.size > 1024 * 1024) throw new Error("For browser storage, choose an image under 1 MB.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Image could not be read."));
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}
