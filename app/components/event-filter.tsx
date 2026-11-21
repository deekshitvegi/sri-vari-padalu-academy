import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { AcademyEvent } from "../data";

export function EventFilter({ events }: { events: AcademyEvent[] }) {
  return (
    <div className="event-list" data-stagger>
      {events.length === 0 && <p className="empty-state">No events are listed yet. Call the academy to ask about the next performance.</p>}
      {events.map((event) => (
        <article className="event-card" key={event.id}>
          <div>{event.type && <span className="event-type">{event.type}</span>}<h3>{event.title}</h3><p>{event.description}</p></div>
          <div className="event-meta"><span><CalendarDays aria-hidden="true" /> {event.date}</span><span><Clock aria-hidden="true" /> {event.time}</span><span><MapPin aria-hidden="true" /> {event.venue}</span></div>
        </article>
      ))}
    </div>
  );
}
