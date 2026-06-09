import type { Event } from "../types/event";

type Props = {
  event: Event;
  onClick: () => void;
};

function EventCard({
  event,
  onClick,
}: Props) {
  /* FORMAT PRICE */
  const formatPrice = (
    price: number
  ) =>
    new Intl.NumberFormat(
      "id-ID"
    ).format(price);

  /* FORMAT DATE */
  const formatDate = (
    date: string
  ) =>
    new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  /* GET LOWEST TICKET PRICE */
  const lowestPrice =
    event.tickets &&
    event.tickets.length > 0
      ? Math.min(
          ...event.tickets.map(
            (ticket) => ticket.price
          )
        )
      : 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        cursor: "pointer",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.15)",
      }}
    >
      {/* EVENT TITLE */}
      <h2 style={{ color: "#111" }}>
        {event.title}
      </h2>

      {/* EVENT LOCATION */}
      <p>
        📍{" "}
        {event.venue_name ||
          event.location}
      </p>

      {/* EVENT DATE */}
      <p>
        📅{" "}
        {formatDate(
          event.start_date
        )}{" "}
        -{" "}
        {formatDate(
          event.end_date
        )}
      </p>

      {/* EVENT PRICE */}
      <p>
        Starting from Rp{" "}
        {formatPrice(lowestPrice)}
      </p>
    </div>
  );
}

export default EventCard;