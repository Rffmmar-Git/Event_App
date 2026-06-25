import prisma from "../config/prisma";

export const getOrganizerAnalyticsService = async (organizerId: number) => {
  /* GET ALL ORGANIZER EVENTS */
  const events = await prisma.events.findMany({
    where: {
      organizer_id: organizerId,
    },

    include: {
      reviews: {
        select: {
          rating: true,
        },
      },

      tickets: {
        select: {
          sold: true,
          quota: true,
          price: true,
        },
      },

      transactions: {
        where: {
          status: "DONE",
        },

        select: {
          final_price: true,
        },
      },
    },
  });

  /* TOTAL EVENTS */
  const totalEvents = events.length;

  /* TOTAL REVENUE */
  const totalRevenue = events.reduce(
    (sum, event) =>
      sum +
      event.transactions.reduce(
        (transactionSum, transaction) =>
          transactionSum + Number(transaction.final_price || 0),
        0,
      ),
    0,
  );

  /* TOTAL TICKETS SOLD */
  const totalTicketsSold = events.reduce(
    (sum, event) =>
      sum +
      event.tickets.reduce(
        (ticketSum, ticket) => ticketSum + (ticket.sold || 0),
        0,
      ),
    0,
  );

  /* TOTAL ATTENDEES */
  const totalAttendees = await prisma.transactions.count({
    where: {
      status: "DONE",

      events: {
        organizer_id: organizerId,
      },
    },
  });

  /* AVERAGE RATING */
  const ratings = events.flatMap((event) =>
    event.reviews.map((review) => review.rating || 0),
  );

  const averageRating =
    ratings.length > 0
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : 0;

  /* REVENUE BY EVENT */
  const revenueByEvent = events.map((event) => {
    const revenue = event.transactions.reduce(
      (sum, transaction) => sum + Number(transaction.final_price || 0),
      0,
    );

    const maxRevenue = event.tickets.reduce(
      (sum, ticket) => sum + (ticket.quota ?? 0) * Number(ticket.price ?? 0),
      0,
    );

    return {
      title: event.title,
      revenue,
      maxRevenue,
    };
  });

  /* TICKETS SOLD BY EVENT */
  const ticketsByEvent = events.map((event) => {
    const sold = event.tickets.reduce(
      (sum, ticket) => sum + (ticket.sold || 0),
      0,
    );

    const totalSeats = event.tickets.reduce(
      (sum, ticket) => sum + (ticket.quota ?? 0),
      0,
    );

    return {
      title: event.title,
      sold,
      totalSeats,
    };
  });

  return {
    totalEvents,
    totalRevenue,
    totalTicketsSold,
    totalAttendees,
    averageRating,
    revenueByEvent,
    ticketsByEvent,
  };
};;