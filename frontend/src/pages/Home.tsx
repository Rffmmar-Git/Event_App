import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/event";
import EventCard from "../components/EventCard";

function Home() {
  /* STATES */
  const [events, setEvents] = useState<Event[]>([]);

  /* HOOKS */
  const navigate = useNavigate();

  /* FETCH EVENTS */
  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  /* UPCOMING EVENTS */
  const upcomingEvents = [...events]
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-700 to-purple-500 rounded-3xl p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">
            Discover Unforgettable Experiences
          </h1>

          <p className="mb-6 text-lg opacity-80">
            Access the best events in Indonesia
          </p>

          {/* HERO ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/events")}
              className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold"
            >
              Explore Events
            </button>
          </div>
        </div>
      </section>

      {/* EVENTS PREVIEW */}
      <section className="py-16 px-6 bg-[#f3ebf9]">
        <div className="max-w-6xl mx-auto">
          {/* SECTION HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>

            <button
              onClick={() => navigate("/events")}
              className="text-purple-600 font-semibold hover:underline"
            >
              View All →
            </button>
          </div>

          {/* EVENTS GRID */}
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
