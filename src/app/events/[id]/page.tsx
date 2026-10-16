import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Event = {
  id: string | number;
  title: string;
  description: string;
  category: string;
  image: string;
  date: string;
  day: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  soldOut: boolean;
};

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { id } = await params;

  let response: Response;

  try {
    response = await fetch(
      `http://localhost:5000/events/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );
  } catch {
    throw new Error(
      "Unable to load event details. Please make sure the event server is running.",
    );
  }

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch event details.");
  }

  const event: Event | null = await response.json();

  if (!event || !event.id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fff8eb] px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          href="/events"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#805c58] transition hover:text-[#e76f61]"
        >
          <span aria-hidden="true">←</span>
          Back to events
        </Link>

        {/* Event Details */}
        <div className="overflow-hidden rounded-2xl border border-[#e5dedc] bg-white shadow-sm">
          {/* Event Image */}
          <div className="relative h-[210px] w-full overflow-hidden bg-[#f1e8df] sm:h-[280px] lg:h-[340px]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
              className="object-cover object-center"
            />

            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#452b2e] shadow-sm">
              {event.category}
            </span>

            {event.soldOut && (
              <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
                Sold out
              </span>
            )}
          </div>

          {/* Details Content */}
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_260px] lg:gap-8">
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e76f61]">
                Discover your next experience
              </p>

              <h1 className="mb-3 text-2xl font-bold leading-tight text-[#452b2e] sm:text-3xl">
                {event.title}
              </h1>

              <p className="mb-5 text-sm leading-7 text-[#805c58] sm:text-base">
                {event.description}
              </p>

              {/* Event Information */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#fff8eb] p-4">
                  <p className="mb-1 text-xs font-medium text-[#805c58]">
                    Date
                  </p>
                  <p className="text-sm font-bold text-[#452b2e]">
                    {event.date} {event.day}
                  </p>
                </div>

                <div className="rounded-xl bg-[#fff8eb] p-4">
                  <p className="mb-1 text-xs font-medium text-[#805c58]">
                    Time
                  </p>
                  <p className="text-sm font-bold text-[#452b2e]">
                    {event.time}
                  </p>
                </div>

                <div className="rounded-xl bg-[#fff8eb] p-4 sm:col-span-2">
                  <p className="mb-1 text-xs font-medium text-[#805c58]">
                    Venue
                  </p>
                  <p className="text-sm font-bold text-[#452b2e]">
                    {event.venue || event.location}
                  </p>
                  {event.venue && event.location && (
                    <p className="mt-1 text-xs text-[#805c58]">
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Ticket Booking Card */}
            <aside className="h-fit rounded-xl border border-[#e5dedc] p-5">
              <p className="mb-1 text-sm text-[#805c58]">Ticket price</p>

              <p className="mb-1 text-3xl font-bold text-[#452b2e]">
                ${event.price}
              </p>

              <p className="mb-5 text-xs text-[#805c58]">Per ticket</p>

              {event.soldOut ? (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 text-sm font-semibold text-gray-600"
                >
                  Sold out
                </button>
              ) : (
                <Link
                  href={`/booking?eventId=${encodeURIComponent(String(event.id))}`}
                  className="block w-full rounded-lg bg-[#e76f61] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#d95d50]"
                >
                  Book Now
                </Link>
              )}

              <p className="mt-3 text-center text-xs leading-5 text-[#805c58]">
                {event.soldOut
                  ? "Tickets are no longer available for this event."
                  : "Your next great experience starts here."}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
