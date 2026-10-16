"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { events as starterEvents, fetchEvents, type EventItem } from "@/lib/events";

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>(starterEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchEvents()
      .then((items) => {
        if (active) setEvents(items);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setEvents([]);
        const responseError = axios.isAxiosError<{ error?: string }>(cause)
          ? cause.response?.data?.error
          : undefined;
        setError(responseError ?? "Could not load events. Check the server and database configuration.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { events, loading, error };
}
