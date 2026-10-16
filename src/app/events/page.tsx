import Footer from "@/components/Footer";
import HeroSection from "./HeroSection";
import EventCard from "./EventCard";

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

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        {events.length > 0 ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-[#805c58]">
            No events found. Please check whether the server is running.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
