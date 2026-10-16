import Footer from "@/components/Footer";
import HeroSection from "./HeroSection";
import EventCard from "./EventCard";
import SearchBar from "./SearchBar";
import EventList from "./EventList";

type Event = {
  id: string | number;
  title: string;
  category: string;
  image: string;
  date: string;
  day: string;
  location: string;
  price: number;
};

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch("http://localhost:5000/events", {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error("Could not fetch events");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function EventPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-[#fff8eb]">
      <HeroSection />

      <EventList events={events} />
    </div>
  );
}
