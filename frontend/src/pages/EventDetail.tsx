import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getEventById, deleteEvent } from "../services/eventService";
import type { Event } from "../types/event";
import { getEventReviews } from "../services/reviewService";
import { formatCurrency } from "../utils/formatCurrency";

function EventDetail() {
  /* ROUTE PARAMS */
  const { id } = useParams();
  const navigate = useNavigate();

  /* STATES */
  const [event, setEvent] = useState<Event | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isOrganizer = user.role === "ORGANIZER";

  const isOwner = event?.organizer_id === user.id;

  const handleDeleteEvent = async () => {
    if (!event) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(event.id);

      alert("Event deleted successfully");

      navigate("/my-events");
    } catch (error: any) {
      alert(error.message || "Failed to delete event");
    }
  };

  /* FETCH EVENT */
  useEffect(() => {
    if (!id) return;

    getEventById(id)
      .then(async (eventData) => {
        setEvent(eventData);

        const reviewData = await getEventReviews(eventData.id);

        setReviews(reviewData);
      })
      .catch(() => {
        setEvent(null);
      });
  }, [id]);

  /* LOADING STATE */
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading event...
      </div>
    );
  }

  /* SELECTED TICKET */
  const selectedTicketData = event.tickets?.find(
    (t) => t.id === selectedTicket,
  );

  /* TICKET STATISTICS */
  const totalQuota =
    event.tickets?.reduce((sum, t) => sum + (t.quota || 0), 0) || 0;

  const totalSold =
    event.tickets?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0;

  const remaining = totalQuota - totalSold;

  const progress = totalQuota > 0 ? (totalSold / totalQuota) * 100 : 0;

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "0";

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="pt-28 px-6 max-w-5xl mx-auto space-y-10">
        {/* HERO BANNER */}
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt={event.title}
            className="h-64 w-full object-cover rounded-2xl shadow-lg"
          />
        ) : (
          <div className="h-64 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl shadow-lg" />
        )}

        {/* EVENT INFORMATION */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h1 className="text-3xl font-bold">{event.title}</h1>

          <div className="flex items-center gap-3 mt-2">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>

          <div className="mt-3">
            <p className="text-gray-600">
              Organized by{" "}
              <span className="font-semibold">{event.users?.name}</span>
            </p>

            <p className="text-yellow-600 font-medium mt-1">
              ⭐ {event.organizer_rating?.average || 0} Star Rating (
              {event.organizer_rating?.count || 0} reviews)
            </p>
          </div>

          {/* EVENT DATE */}
          <div className="space-y-1 text-gray-600">
            <p>
              📅{" "}
              {(() => {
                const start = new Date(event.start_date);
                const end = new Date(event.end_date);

                const sameDay =
                  start.getFullYear() === end.getFullYear() &&
                  start.getMonth() === end.getMonth() &&
                  start.getDate() === end.getDate();

                if (sameDay) {
                  return `${start.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })} • ${start.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${end.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`;
                }

                return `${start.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })} ${start.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${end.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })} ${end.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`;
              })()}
            </p>
          </div>

          <div className="space-y-1 text-gray-600">
            {event.venue_name && <p>📍 {event.venue_name}</p>}

            {event.venue_address && <p>{event.venue_address}</p>}

            <p>{event.location}</p>
          </div>

          {/* DESCRIPTION */}
          <div className="pt-2 border-t">
            <h2 className="font-semibold text-lg mb-2">About This Event</h2>

            <p className="text-gray-700 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p>{remaining} seats remaining</p>
        </div>

        {/* EVENT LOCATION */}
        {event.latitude && event.longitude && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Event Location</h2>

            <iframe
              title="event-location"
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
              className="rounded-xl"
              src={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`}
            />

            <div className="mt-4 text-gray-600">
              {event.venue_name && <p>📍 {event.venue_name}</p>}

              {event.venue_address && <p>{event.venue_address}</p>}

              <p>{event.location}</p>
            </div>
          </div>
        )}

        {/* TICKETS */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h2 className="font-semibold text-lg">Tickets</h2>

          {event.tickets?.map((ticket) => {
            const isFull = (ticket.sold || 0) >= (ticket.quota || 0);

            return (
              <div
                key={ticket.id}
                className="flex justify-between border p-4 rounded-xl"
              >
                <div>
                  <p>{ticket.name}</p>

                  <p>
                    {(ticket.quota || 0) - (ticket.sold || 0)} seats available
                  </p>
                </div>

                <div>
                  <p>Rp {formatCurrency(ticket.price)}</p>

                  {!isFull && !isOrganizer && (
                    <button
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`px-4 py-2 rounded-xl font-medium transition ${
                        selectedTicket === ticket.id
                          ? "bg-green-600 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {selectedTicket === ticket.id ? "✓ Selected" : "Select"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="font-semibold text-lg mb-4">Ticket Quantity</h2>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 bg-gray-200 rounded-xl"
              >
                -
              </button>

              <span className="text-xl font-semibold">{quantity}</span>

              <button
                onClick={() => {
                  const maxSeats =
                    (selectedTicketData?.quota || 0) -
                    (selectedTicketData?.sold || 0);

                  setQuantity((prev) => Math.min(prev + 1, maxSeats));
                }}
                className="w-10 h-10 bg-purple-600 text-white rounded-xl"
              >
                +
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Available seats:{" "}
              {(selectedTicketData?.quota || 0) -
                (selectedTicketData?.sold || 0)}
            </p>

            <p className="text-gray-500 mt-3">
              You are purchasing {quantity} {selectedTicketData?.name}
              {quantity > 1 ? " tickets" : " ticket"}.
            </p>
          </div>
        )}

        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{selectedTicketData?.name}</p>

                <p className="text-gray-500">Quantity: {quantity}</p>
              </div>

              <button
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      eventId: event.id,
                      ticketId: selectedTicket,
                      quantity,
                    },
                  })
                }
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        )}

        {isOrganizer && isOwner && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-3">Organizer Tools</h2>

            <p className="text-gray-600 mb-4">
              You are the organizer of this event.
            </p>

            <button
              onClick={() => navigate(`/events/${event.id}/edit`)}
              className="flex gap-3 mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
            >
              Edit Event
            </button>

            <button
              onClick={() => navigate(`/events/${event.id}/attendees`)}
              className="flex gap-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
            >
              View Attendees
            </button>

            <button
              onClick={handleDeleteEvent}
              className="flex gap-3 mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
            >
              Delete Event
            </button>
          </div>
        )}

        {/* REVIEWS */}
        {isOrganizer && isOwner && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Reviews</h2>

              <span className="font-medium">
                ⭐ {averageRating} ({reviews.length})
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-xl p-4">
                    <div className="flex justify-between">
                      <p className="font-semibold">{review.users?.name}</p>

                      <p>{"⭐".repeat(review.rating)}</p>
                    </div>

                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
