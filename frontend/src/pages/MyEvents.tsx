import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IMAGE_URL } from "../services/eventService";

import Navbar from "../components/Navbar";

import { getMyEvents } from "../services/eventService";

import type { Event } from "../types/event";

function MyEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="pt-32 text-center">Loading...</div>
      </>
    );
  }

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      <Navbar />

      <section className="pt-32 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Events</h1>

        {events.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <h2 className="text-2xl font-bold mb-2">No Events Yet</h2>

            <p className="text-gray-500">
              Create your first event to get started.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => {
              const totalSeats =
                event.tickets?.reduce((sum, ticket) => sum + ticket.quota, 0) ??
                0;

              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="bg-white rounded-xl shadow cursor-pointer hover:-translate-y-2 transition"
                >
                  {event.banner_url ? (
                    <img
                      src={`${IMAGE_URL}/${event.banner_url}`}
                      alt={event.title}
                      className="h-40 w-full object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="h-40 bg-gradient-to-r from-purple-500 to-violet-600 rounded-t-xl" />
                  )}

                  <div className="p-4">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full mb-2">
                      {event.category}
                    </span>

                    <h3 className="font-bold text-lg">{event.title}</h3>

                    <p className="text-sm text-gray-500">📍 {event.location}</p>

                    <p className="text-sm text-gray-500">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>

                    <p className="mt-3 font-medium">
                      🎫 {totalSeats} total seats
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyEvents;
