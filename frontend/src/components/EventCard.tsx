import type { Event } from "../types/event";
import { IMAGE_URL } from "../services/eventService";

type Props = {
  event: Event;
  onClick: () => void;
};

function EventCard({ event, onClick }: Props) {
  /* FORMAT PRICE */
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID").format(price);

  /* FORMAT DATE */
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /* GET LOWEST TICKET PRICE */
  const lowestPrice =
    event.tickets && event.tickets.length > 0
      ? Math.min(...event.tickets.map((ticket) => ticket.price))
      : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* EVENT BANNER */}
      {event.banner_url ? (
        <img
          src={`${IMAGE_URL}/${event.banner_url}`}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-purple-500 to-violet-600" />
      )}

      <div className="p-5">
        {/* CATEGORY */}
        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
          {event.category}
        </span>

        {/* EVENT TITLE */}
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
          {event.title}
        </h2>

        {/* EVENT LOCATION */}
        <p className="text-gray-600 mb-1">
          📍 {event.venue_name || event.location}
        </p>

        {/* EVENT DATE */}
        <p className="text-gray-600 mb-4">
          📅 {formatDate(event.start_date)} - {formatDate(event.end_date)}
        </p>

        {/* EVENT PRICE */}
        <p className="text-lg font-semibold text-purple-700">
          Starting from Rp {formatPrice(lowestPrice)}
        </p>
      </div>
    </div>
  );
}

export default EventCard;
