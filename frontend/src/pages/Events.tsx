import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getEvents } from "../services/eventService";
import useDebounce from "../hooks/useDebounce";
import type { Event } from "../types/event";

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
  const categories = [
    "all",
    ...new Set(
      events.map((e) => e.category)
    ),
  ];

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
        <h1 className="text-3xl font-bold mb-6">
          Browse Events
        </h1>

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 p-4 rounded-full border border-gray-300"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="p-4 rounded-full border border-gray-300 bg-white"
          >
            <option value="all">
              All Events
            </option>

            {categories
              .filter(
                (cat) => cat !== "all"
              )
              .map((cat, i) => (
                <option
                  key={i}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
          </select>

          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="p-4 rounded-full border border-gray-300 bg-white"
          >
            <option value="all">
              All Locations
            </option>

            {locations
              .filter(
                (loc) => loc !== "all"
              )
              .map((loc, i) => (
                <option
                  key={i}
                  value={loc}
                >
                  {loc}
                </option>
              ))}
          </select>
        </div>

        {/* EVENTS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => {
            /* LOWEST TICKET PRICE */
            const lowestPrice =
              event.tickets &&
              event.tickets.length > 0
                ? Math.min(
                    ...event.tickets.map(
                      (t: {
                        price: number;
                      }) => t.price
                    )
                  )
                : 0;

            return (
              <div
                key={event.id}
                onClick={() =>
                  navigate(
                    `/events/${event.id}`
                  )
                }
                className="bg-white rounded-xl shadow hover:-translate-y-2 transition cursor-pointer"
              >
                {/* EVENT BANNER */}
                <div className="h-40 bg-gray-200 rounded-t-xl"></div>

                {/* EVENT DETAILS */}
                <div className="p-4">
                  <p className="text-sm text-purple-600">
                    {new Date(
                      event.start_date
                    ).toLocaleDateString()}
                  </p>

                  <h3 className="font-bold text-lg">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    📍 {event.location}
                  </p>

                  <p className="mt-2 font-semibold">
                    Rp{" "}
                    {new Intl.NumberFormat(
                      "id-ID"
                    ).format(lowestPrice)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Events;