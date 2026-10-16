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
