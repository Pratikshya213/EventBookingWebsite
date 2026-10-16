"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import type { EventItem } from "@/lib/events";
import { formatPrice, formatTime, longDate } from "@/lib/format";

type Props = {
  events: EventItem[];
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
};

export default function AdminEventsTable({ events, onEdit, onDelete }: Props) {
  if (events.length === 0) {
    return <div className="empty"><h2>No events yet</h2><p>Use &ldquo;Add event&rdquo; to create the first one.</p></div>;
  }

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Category</th>
            <th>Date &amp; time</th>
            <th>Venue</th>
            <th>Price</th>
            <th>Tickets left</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                <div className="cell-event">
                  <Image src={event.image} alt="" width={48} height={48} />
                  <strong>{event.title}</strong>
                </div>
              </td>
              <td><span className="pill">{event.category}</span></td>
              <td>{longDate(event.date)}<br /><span className="muted">{formatTime(event.time)}</span></td>
              <td>{event.venue}<br /><span className="muted">{event.city}</span></td>
              <td>{formatPrice(event.price)}</td>
              <td>{event.availableTickets <= 0 ? <span className="badge badge-red">Sold out</span> : event.availableTickets}</td>
              <td>
                <div className="row-actions">
                  <button type="button" className="icon-btn" aria-label={`Edit ${event.title}`} onClick={() => onEdit(event)}><Pencil size={14} /></button>
                  <button type="button" className="icon-btn icon-btn-danger" aria-label={`Delete ${event.title}`} onClick={() => onDelete(event)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
