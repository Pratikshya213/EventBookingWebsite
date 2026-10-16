"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdminEventForm from "@/components/admin/AdminEventForm";
import AdminEventsTable from "@/components/admin/AdminEventsTable";
import AdminBookingsTable from "@/components/admin/AdminBookingsTable";
import { eventFromBooking, formatPrice } from "@/lib/format";
import type { Booking } from "@/lib/bookings";
import type { EventItem } from "@/lib/events";
import api from "@/lib/axios";

type Tab = "events" | "bookings";

async function listEvents(): Promise<EventItem[]> {
  const response = await api.get<EventItem[]>("/events");
  return response.data;
}

async function listBookings(): Promise<Booking[]> {
  const response = await api.get<Booking[]>("/bookings");
  return response.data;
}

async function deleteEvent(id: EventItem["id"]): Promise<void> {
  await api.delete(`/events/${encodeURIComponent(String(id))}`);
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tab, setTab] = useState<Tab>("events");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | undefined>(undefined);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    Promise.all([listEvents(), listBookings()])
      .then(([eventList, bookingList]) => {
        if (!active) return;
        setEvents(eventList);
        setBookings(bookingList);
      })
      .catch(() => {
        if (active) setLoadError("Could not load admin data. Check the database configuration and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAdmin]);

  if (authLoading) {
    return <main className="page"><div className="container"><div className="skeleton" /></div></main>;
  }

  if (!isAdmin) {
    return (
      <main className="nf">
        <div>
          <div className="eyebrow">Admins only</div>
          <h1>Hold on</h1>
          <p>{user ? "This account doesn't have admin access." : "Please log in with an admin account."}</p>
          <Link className="btn btn-primary" href={user ? "/" : "/login"}>{user ? "Back to home" : "Log in"}</Link>
        </div>
      </main>
    );
  }

  const ticketsBooked = bookings.reduce((sum, b) => sum + b.tickets, 0);
  const revenue = bookings.reduce((sum, b) => sum + (eventFromBooking(b).price ?? 0) * b.tickets, 0);

  function openAdd() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(event: EventItem) {
    setEditing(event);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleSaved(saved: EventItem) {
    setEvents((current) =>
      current.some((e) => e.id === saved.id)
        ? current.map((e) => (e.id === saved.id ? saved : e))
        : [saved, ...current],
    );
    closeForm();
  }

  async function handleDelete(event: EventItem) {
    if (!window.confirm(`Delete "${event.title}"? This can't be undone.`)) return;
    try {
      await deleteEvent(event.id);
      setEvents((current) => current.filter((e) => e.id !== event.id));
    } catch {
      window.alert("Could not delete the event. Please try again.");
    }
  }

  return (
    <main className="page">
      <div className="container">
        <div className="admin-head">
          <div>
            <div className="eyebrow" style={{ marginTop: 0 }}>Admin</div>
            <h1 className="page-title">Dashboard</h1>
          </div>
          {tab === "events" && !formOpen && (
            <button type="button" className="btn btn-primary" onClick={openAdd}><Plus size={14} /> Add event</button>
          )}
        </div>

        <div className="admin-stats">
          <div className="stat-card"><small>Events</small><strong>{events.length}</strong></div>
          <div className="stat-card"><small>Bookings</small><strong>{bookings.length}</strong></div>
          <div className="stat-card"><small>Tickets booked</small><strong>{ticketsBooked}</strong></div>
          <div className="stat-card"><small>Revenue</small><strong>{formatPrice(revenue)}</strong></div>
        </div>

        {loadError && <p role="alert" className="form-alert">{loadError}</p>}

        <div className="admin-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "events"} className={tab === "events" ? "active" : ""} onClick={() => setTab("events")}>Events</button>
          <button type="button" role="tab" aria-selected={tab === "bookings"} className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>Bookings</button>
        </div>

        {loading ? (
          <div className="skeleton" />
        ) : tab === "events" ? (
          <>
            {formOpen && <AdminEventForm key={editing?.id ?? "new"} initial={editing} onSaved={handleSaved} onCancel={closeForm} />}
            <AdminEventsTable events={events} onEdit={openEdit} onDelete={handleDelete} />
          </>
        ) : (
          <AdminBookingsTable bookings={bookings} />
        )}
      </div>
    </main>
  );
}
