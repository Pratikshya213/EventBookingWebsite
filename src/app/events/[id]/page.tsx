import EventDetailsClient from "./EventDetailsClient";
import { events } from "@/lib/events";

export function generateStaticParams() {
  return events.map((event) => ({ id: event.slug }));
}

export default function EventDetailsPage() {
  return <EventDetailsClient />;
}
