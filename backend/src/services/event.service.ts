import prisma from "../config/prisma";

/* GET ALL EVENTS */
export const getAllEvents = async (query: any) => {
  const {
    search,
    category,
    location,
    page,
    limit,
  } = query;

  /* PAGINATION */
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 6, 1);
  const skip = (pageNumber - 1) * limitNumber;

  /* FETCH EVENTS */
  return await prisma.events.findMany({
    where: {
      /* UPCOMING EVENTS ONLY */
      start_date: {
        gte: new Date(),
      },

      AND: [
        search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},

        category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},

        location
          ? {
              location: {
                contains: location,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },

    /* INCLUDE RELATED DATA */
    include: {
      tickets: true,
      vouchers: true,
    },

    /* SORT BY EVENT DATE */
    orderBy: {
      start_date: "asc",
    },

    ...(limit
      ? {
        skip,
        take: limitNumber,
      }
    : {})
  });
};

/* GET EVENT BY ID */
export const getEventByIdService = async (id: number) => {
  const event = await prisma.events.findUnique({
    where: { id },

    include: {
      tickets: true,
      vouchers: true,

      users: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!event || !event.organizer_id) {
    return event;
  }

  const organizerReviews =
    await prisma.reviews.findMany({
      where: {
        events: {
          organizer_id:
            event.organizer_id,
        },
      },

      select: {
        rating: true,
      },
    });

  const reviewCount =
    organizerReviews.length;

  const averageRating =
    reviewCount > 0
      ? Number(
          (
            organizerReviews.reduce(
              (sum, review) =>
                sum +
                (review.rating || 0),
              0
            ) / reviewCount
          ).toFixed(1)
        )
      : 0;

  return {
    ...event,

    organizer_rating: {
      average: averageRating,
      count: reviewCount,
    },
  };
};

/* GET MY EVENTS */
export const getMyEventsService = async (
  organizerId: number
) => {
  return await prisma.events.findMany({
    where: {
      organizer_id: organizerId,
    },

    include: {
      tickets: true,
      vouchers: true,
    },

    orderBy: {
      created_at: "desc",
    },
  });
};

/* CREATE EVENT */
export const createEventService = async (
  data: any,
  organizerId: number
) => {
  const {
    title,
    description,
    location,
    category,
    start_date,
    end_date,
    tickets,
    venue_name,
    venue_address,
    latitude,
    longitude,
  } = data;

  /* VALIDATE REQUIRED FIELDS */
  if (!title || !location || !category || !start_date || !end_date) {
    throw new Error("Missing required fields");
  }

  /* VALIDATE DATE RANGE */
  if (new Date(start_date) >= new Date(end_date)) {
    throw new Error("Invalid date range");
  }

  /* CREATE EVENT */
  return await prisma.events.create({
    data: {
      title,
      description,
      location,
      category,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      organizer_id: organizerId,

      /* VENUE INFORMATION */
      venue_name: venue_name || null,
      venue_address: venue_address || null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,

      /* CREATE TICKETS */
      tickets: tickets?.length
        ? {
            create: tickets.map((t: any) => {
              /* VALIDATE TICKET DATA */
              if (!t.name || t.price < 0 || t.quota <= 0) {
                throw new Error("Invalid ticket data");
              }

              return {
                name: t.name,
                price: Number(t.price),
                quota: Number(t.quota),
                sold: 0,
              };
            }),
          }
        : undefined,
    },

    /* INCLUDE CREATED TICKETS */
    include: {
      tickets: true,
    },
  });
};

/* UPDATE EVENT */
export const updateEventService = async (
  eventId: number,
  organizerId: number,
  data: any
) => {
  const existingEvent =
    await prisma.events.findUnique({
      where: { id: eventId },
    });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  if (
    existingEvent.organizer_id !==
    organizerId
  ) {
    throw new Error(
      "You are not allowed to edit this event"
    );
  }

  const {
    title,
    description,
    location,
    category,
    start_date,
    end_date,
    venue_name,
    venue_address,
    latitude,
    longitude,
    tickets,
  } = data;

  if (
    start_date &&
    end_date &&
    new Date(start_date) >=
      new Date(end_date)
  ) {
    throw new Error(
      "Invalid date range"
    );
  }

  return await prisma.$transaction(async (tx) => {
    const updatedEvent = await tx.events.update({
      where: {
        id: eventId,
      },

      data: {
        title,
        description,
        location,
        category,

        start_date: start_date ? new Date(start_date) : undefined,

        end_date: end_date ? new Date(end_date) : undefined,

        venue_name,
        venue_address,

        latitude: latitude !== undefined ? Number(latitude) : undefined,

        longitude: longitude !== undefined ? Number(longitude) : undefined,
      },
    });

    if (Array.isArray(tickets)) {
      for (const ticket of tickets) {
        if (ticket.id) {
          await tx.tickets.update({
            where: {
              id: ticket.id,
            },

            data: {
              name: ticket.name,
              price: Number(ticket.price),
              quota: Number(ticket.quota),
            },
          });
        }
      }
    }

    return tx.events.findUnique({
      where: {
        id: eventId,
      },

      include: {
        tickets: true,
        vouchers: true,
      },
    });
  });
};

/* GET EVENT ATTENDEES */
export const getEventAttendeesService =
  async (
    eventId: number,
    organizerId: number
  ) => {
    const event =
      await prisma.events.findUnique({
        where: {
          id: eventId,
        },
      });

    if (!event) {
      throw new Error(
        "Event not found"
      );
    }

    if (
      event.organizer_id !==
      organizerId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    return await prisma.transactions.findMany({
      where: {
        event_id: eventId,
        status: "DONE",
      },

      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        transaction_items: {
          include: {
            tickets: true,
          },
        },
      },

      orderBy: {
        created_at: "desc",
      },
    });
  };