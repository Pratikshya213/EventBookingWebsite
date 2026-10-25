"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import EventCard from "@/app/events/EventCard";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded) {
    return (
      <main className="page">
        <div className="container container-sm empty">
          <p>Loading favorites...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="eyebrow">Saved for later</div>
        <h1 className="page-title">Your favorites</h1>

        {favorites.length > 0 ? (
          <>
            <p className="mb-6">
              {favorites.length} {favorites.length === 1 ? "event" : "events"}{" "}
              saved.
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {favorites.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty">
            <p>Favorite events you save will appear here.</p>

            <Link href={routes.events} className="btn btn-primary">
              Browse events
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
