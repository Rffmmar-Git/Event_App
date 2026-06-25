import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventCategories } from "../constants/categories";
import Navbar from "../components/Navbar";
import { getEvents } from "../services/eventService";
import useDebounce from "../hooks/useDebounce";
import type { Event } from "../types/event";
import EventCard from "../components/EventCard";

function Events() {
  /* STATES */
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  /* HOOKS */
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);

  /* FETCH EVENTS */
  useEffect(() => {
    getEvents({
      search: debouncedSearch || undefined,
      category:
        category !== "all"
          ? category
          : undefined,
      location:
        location !== "all"
          ? location
          : undefined,
    })
      .then(setEvents)
      .catch((err) =>
        console.error(
          "Fetch events error:",
          err
        )
      );
  }, [
    debouncedSearch,
    category,
    location,
  ]);

  /* FILTER OPTIONS */
  const locations = [
    "all",
    ...new Set(
      events.map((e) => e.location)
    ),
  ];

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <section className="pt-32 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Browse Events</h1>

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-full border border-gray-300"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-4 rounded-full border border-gray-300 bg-white"
          >
            <option value="all">All Events</option>

            {eventCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-4 rounded-full border border-gray-300 bg-white"
          >
            <option value="all">All Locations</option>

            {locations
              .filter((loc) => loc !== "all")
              .map((loc, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
          </select>
        </div>

        {/* EVENTS GRID */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Events Found
            </h2>

            <p className="text-gray-500">
              Sorry, there are currently no events matching your search or
              filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
  {events.map((event) => (
    <EventCard
      key={event.id}
      event={event}
      onClick={() =>
        navigate(`/events/${event.id}`)
      }
    />
  ))}
</div>
        )}
      </section>
    </div>
  );
}

export default Events;