"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/context/FavoritesContext";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/format";

type Event = {
  id: string | number;
  slug?: string;
  title: string;
  category: string;
  image: string;
  date: string;
  day: string;
  location: string;
  price: number;
};

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(event.id);

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const eventHref = routes.eventDetail(event.slug ?? String(event.id));

  const handleFavorite = () => {
    toggleFavorite(event);

    setMessage(favorite ? "Removed from favorites" : "Saved for later!");
    setShowMessage(true);

    window.setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group overflow-hidden rounded-2xl border border-[#e5dedc] bg-white shadow-sm hover:shadow-xl"
    >
      {/* Event Image */}
      <div className="relative h-[190px] sm:h-[220px]">
        <Link
          href={eventHref}
          aria-label={`View details for ${event.title}`}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        </Link>

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#452b2e]">
          {event.category}
        </span>

        {/* Favorite Button */}
        <motion.button
          type="button"
          aria-label={
            favorite
              ? `Remove ${event.title} from favorites`
              : `Add ${event.title} to favorites`
          }
          aria-pressed={favorite}
          onClick={handleFavorite}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5dedc] bg-white/95 transition-colors duration-300 ${
            favorite ? "text-red-500" : "text-red-500 hover:text-red-600"
          }`}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill={favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              scale: favorite ? [1, 1.25, 1] : 1,
            }}
            transition={{ duration: 0.25 }}
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </motion.svg>
        </motion.button>

        {/* Popup Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="status"
              className="absolute right-3 top-16 z-10 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#452b2e] shadow-lg"
            >
              <span className="mr-2 text-red-500">♥</span>
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-[54px_minmax(0,1fr)] gap-x-4 px-5 py-5 sm:grid-cols-[60px_minmax(0,1fr)] sm:gap-x-5">
        {/* Date */}
        <div className="row-span-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e76f61]">
            {event.date}
          </p>

          <p className="text-3xl font-bold tracking-tight text-[#452b2e]">
            {event.day}
          </p>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold leading-snug text-[#452b2e] transition-colors duration-300 group-hover:text-[#e76f61] sm:text-xl">
          {event.title}
        </h2>

        {/* Location */}
        <div className="col-start-2 mt-3 flex items-start gap-2 text-sm text-[#805c58] sm:text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0"
          >
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>

          <p>{event.location}</p>
        </div>

        {/* Price */}
        <p className="col-start-2 mt-4 self-center text-base font-bold text-[#452b2e] sm:text-lg">
          From {formatPrice(event.price)}
        </p>

        {/* View Event */}
        <Link
          href={eventHref}
          aria-label={`View ${event.title}`}
          className="col-start-2 row-start-4 ml-auto mt-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9b77f] bg-[#ffe3ad] text-[#452b2e] transition-all duration-300 hover:translate-x-1 hover:bg-[#f8d18a]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}
