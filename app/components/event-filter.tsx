"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { events } from "../data";

const filters = ["All", "Performance", "Workshop", "Camp", "Registration"];

export function EventFilter() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? events : events.filter((event) => event.type === filter);

  return (
    <>
      <div className="event-filters" role="group" aria-label="Filter event archive">
        {filters.map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="event-list" data-stagger>
        {visible.map((event, index) => (
          <article className="event-card glass" key={`${event.title}-${event.date}`}>
            <div className="event-number">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <span className="event-type">{event.type}</span>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
            <div className="event-meta">
              <span><CalendarDays /> {event.date}</span>
              <span><Clock /> {event.time}</span>
              <span><MapPin /> {event.venue}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
