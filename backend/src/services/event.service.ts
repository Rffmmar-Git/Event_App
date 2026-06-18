import prisma from "../config/prisma";

/* GET ALL EVENTS */
export const getAllEvents = async (query: any) => {
  const {
    search,
    category,
    location,
    page = "1",
    limit = "6",
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

    skip,
    take: limitNumber,
  });
};

/* GET EVENT BY ID */
export const getEventByIdService = async (id: number) => {
  return await prisma.events.findUnique({
    where: { id },

    /* INCLUDE RELATED DATA */
    include: {
      tickets: true,
      vouchers: true,
    },
  });
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