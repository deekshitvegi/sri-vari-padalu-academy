import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { AcademyEvent } from "../data";

export function EventFilter({ events }: { events: AcademyEvent[] }) {
  return (
    <div className="event-list" data-stagger>
      {events.length === 0 && <p className="empty-state">No events are published yet. Please contact the academy for the next performance date.</p>}
      {events.map((event, index) => (
        <article className="event-card liquid-glass" key={event.id}>
          <div className="event-number">{String(index + 1).padStart(2, "0")}</div>
          <div><span className="event-type">{event.type} · Archive</span><h3>{event.title}</h3><p>{event.description}</p></div>
          <div className="event-meta"><span><CalendarDays /> {event.date}</span><span><Clock /> {event.time}</span><span><MapPin /> {event.venue}</span></div>
        </article>
      ))}
    </div>
  );
}
