import prisma from "../config/prisma";

/* GET MY AVAILABLE COUPONS */
export const getMyCouponsService = async (
  userId: number
) => {
  const now = new Date();

  return await prisma.coupons.findMany({
    where: {
      user_id: userId,
      is_used: false,
      expired_at: {
        gt: now,
      },
    },

    orderBy: {
      expired_at: "asc",
    },
  });
};