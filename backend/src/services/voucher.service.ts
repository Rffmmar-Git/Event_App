import prisma from "../config/prisma";

/* CREATE VOUCHER */
export const createVoucherService = async (
  data: any,
  organizerId: number
) => {
  const {
    event_id,
    code,
    discount_amount,
    quota,
    start_date,
    end_date,
  } = data;

  const event = await prisma.events.findUnique({
    where: {
      id: Number(event_id),
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.organizer_id !== organizerId) {
    throw new Error("Unauthorized");
  }

  if (
    !code ||
    !discount_amount ||
    !quota ||
    !start_date ||
    !end_date
  ) {
    throw new Error("Missing required fields");
  }

  if (
    new Date(start_date) >=
    new Date(end_date)
  ) {
    throw new Error("Invalid date range");
  }

  return await prisma.vouchers.create({
    data: {
      event_id: Number(event_id),
      code,
      discount_amount: Number(discount_amount),
      quota: Number(quota),
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      used_count: 0,
    },
  });
};

/* GET EVENT VOUCHERS */
export const getEventVouchersService =
  async (eventId: number) => {
    return await prisma.vouchers.findMany({
      where: {
        event_id: eventId,
      },

      orderBy: {
        id: "desc",
      },
    });
  };

/* UPDATE VOUCHER */
export const updateVoucherService = async (
  voucherId: number,
  data: any,
  organizerId: number
) => {
  const voucher =
    await prisma.vouchers.findUnique({
      where: {
        id: voucherId,
      },

      include: {
        events: true,
      },
    });

  if (!voucher) {
    throw new Error("Voucher not found");
  }

  if (
    voucher.events?.organizer_id !==
    organizerId
  ) {
    throw new Error("Unauthorized");
  }

  return await prisma.vouchers.update({
    where: {
      id: voucherId,
    },

    data: {
      code: data.code,
      discount_amount:
        data.discount_amount,
      quota: data.quota,
      start_date: data.start_date
        ? new Date(data.start_date)
        : undefined,
      end_date: data.end_date
        ? new Date(data.end_date)
        : undefined,
    },
  });
};

/* DELETE VOUCHER */
export const deleteVoucherService =
  async (
    voucherId: number,
    organizerId: number
  ) => {
    const voucher =
      await prisma.vouchers.findUnique({
        where: {
          id: voucherId,
        },

        include: {
          events: true,
        },
      });

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    if (
      voucher.events?.organizer_id !==
      organizerId
    ) {
      throw new Error("Unauthorized");
    }

    await prisma.vouchers.delete({
      where: {
        id: voucherId,
      },
    });

    return true;
  };