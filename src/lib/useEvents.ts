"use client";

import { useEffect, useState } from "react";
import { events as starterEvents, fetchEvents, type EventItem } from "@/lib/events";

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>(starterEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchEvents()
      .then((items) => {
        if (active) setEvents(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { events, loading };
}
