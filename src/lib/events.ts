const STORAGE_KEY = "happen-events";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  image: string;
  description: string;
  availableTickets: number;
};

// Starter events seed a new database and help display older browser-stored bookings.
export const events: EventItem[] = [
  {
    id: "event-1",
    slug: "kathmandu-music-festival",
    title: "Kathmandu Music Festival",
    category: "Music",
    date: "2026-11-14",
    time: "17:00",
    venue: "Bhrikutimandap",
    city: "Kathmandu",
    price: 1500,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy an evening of live music, local artists, and unforgettable performances.",
    availableTickets: 120,
  },
  {
    id: "event-2",
    slug: "creative-arts-exhibition",
    title: "Creative Arts Exhibition",
    category: "Arts",
    date: "2026-11-20",
    time: "11:00",
    venue: "Nepal Art Council",
    city: "Kathmandu",
    price: 500,
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80",
    description: "Discover contemporary art, installations, and work by emerging creatives.",
    availableTickets: 60,
  },
  {
    id: "event-3",
    slug: "startup-connect-nepal",
    title: "Startup Connect Nepal",
    category: "Business",
    date: "2026-12-02",
    time: "09:30",
    venue: "The Plaza",
    city: "Lalitpur",
    price: 1000,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    description: "Meet founders, exchange ideas, and build connections with Nepal's startup community.",
    availableTickets: 0,
  },
  {
    id: "event-4",
    slug: "weekend-food-carnival",
    title: "Weekend Food Carnival",
    category: "Food",
    date: "2026-12-12",
    time: "12:00",
    venue: "Jawalakhel Ground",
    city: "Lalitpur",
    price: 300,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    description: "Try new flavours, discover local food stalls, and spend a delicious day out.",
    availableTickets: 200,
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}

/** Loads user-created events from this browser and combines them with starter data. */
export async function fetchEvents(): Promise<EventItem[]> {
  if (typeof window === "undefined") return events;
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    const extras = Array.isArray(saved) ? saved as EventItem[] : [];
    const removed = new Set(JSON.parse(localStorage.getItem(`${STORAGE_KEY}-removed`) ?? "[]") as string[]);
    const extraIds = new Set(extras.map((item) => item.id));
    const combined = [...events.filter((item) => !removed.has(item.id) && !extraIds.has(item.id)), ...extras];
    return combined.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  } catch {
    return events;
  }
}

export function saveLocalEvent(input: Omit<EventItem, "id">, id?: string): EventItem {
  const current = readLocalEvents();
  const event = { ...input, id: id ?? `event-${Date.now()}` };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current.filter((item) => item.id !== event.id), event]));
  const removed = readRemovedEvents().filter((item) => item !== event.id);
  localStorage.setItem(`${STORAGE_KEY}-removed`, JSON.stringify(removed));
  return event;
}

export function deleteLocalEvent(id: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readLocalEvents().filter((item) => item.id !== id)));
  if (events.some((item) => item.id === id)) {
    localStorage.setItem(`${STORAGE_KEY}-removed`, JSON.stringify([...new Set([...readRemovedEvents(), id])]));
  }
}

function readLocalEvents(): EventItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value as EventItem[] : [];
  } catch { return []; }
}

function readRemovedEvents(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-removed`) ?? "[]");
    return Array.isArray(value) ? value as string[] : [];
  } catch { return []; }
}
