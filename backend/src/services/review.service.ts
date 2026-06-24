import prisma from "../config/prisma";

/* CREATE REVIEW */
export const createReviewService = async (userId: number, data: any) => {
  const { event_id, rating, comment } = data;

  if (!event_id || !rating) {
    throw new Error("Missing required fields");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const event = await prisma.events.findUnique({
    where: {
      id: Number(event_id),
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  /* EVENT MUST BE FINISHED */
  if (event.end_date && event.end_date > new Date()) {
    throw new Error("You can leave a review after the event ends");
  }

  /* USER MUST HAVE ATTENDED */
  const transaction = await prisma.transactions.findFirst({
    where: {
      user_id: userId,
      event_id: Number(event_id),
      status: "DONE",
    },
  });

  if (!transaction) {
    throw new Error("You did not attend this event");
  }

  /* ONE REVIEW PER EVENT */
  const existingReview = await prisma.reviews.findFirst({
    where: {
      user_id: userId,
      event_id: Number(event_id),
    },
  });

  if (existingReview) {
    throw new Error("You already reviewed this event");
  }

  return await prisma.reviews.create({
    data: {
      user_id: userId,
      event_id: Number(event_id),
      rating: Number(rating),
      comment,
    },

    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

/* GET EVENT REVIEWS */
export const getEventReviewsService =
  async (
    eventId: number
  ) => {
    return await prisma.reviews.findMany({
      where: {
        event_id: eventId,
      },

      include: {
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        created_at: "desc",
      },
    });
  };