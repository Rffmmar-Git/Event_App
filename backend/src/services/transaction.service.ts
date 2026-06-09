import prisma from "../config/prisma";

/* CREATE TRANSACTION SERVICE */
export const createTransactionService = async (data: any) => {
  const { ticket_id, quantity, voucher_id, use_points = false } = data;

  /* VALIDATE INPUT */
  if (!ticket_id || !quantity || quantity <= 0) {
    throw new Error("Invalid input");
  }

  return await prisma.$transaction(async (tx) => {
    /* GET TICKET */
    const ticket = await tx.tickets.findUnique({
      where: { id: ticket_id },
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const sold = ticket.sold || 0;
    const quota = ticket.quota || 0;
    const remaining = quota - sold;

    /* CHECK TICKET AVAILABILITY */
    if (quantity > remaining) {
      throw new Error("Not enough seats");
    }

    const price = ticket.price || 0;
    const subtotal = price * quantity;

    /* APPLY VOUCHER */
    let discount = 0;
    let voucherUsed = false;

    if (voucher_id) {
      const voucher = await tx.vouchers.findUnique({
        where: { id: voucher_id },
      });

      if (!voucher) {
        throw new Error("Voucher not found");
      }

      const now = new Date();

      if (voucher.start_date! > now || voucher.end_date! < now) {
        throw new Error("Voucher expired");
      }

      if ((voucher.used_count || 0) >= (voucher.quota || 0)) {
        throw new Error("Voucher quota exceeded");
      }

      discount = voucher.discount_amount || 0;
      voucherUsed = true;

      /* UPDATE VOUCHER USAGE */
      await tx.vouchers.update({
        where: { id: voucher_id },
        data: {
          used_count: {
            increment: 1,
          },
        },
      });
    }

    /* GET USER */
    const userId = 2;

    const user = await tx.users.findUnique({
      where: { id: userId },
    });

    /* APPLY POINTS */
    let pointsUsed = 0;

    if (use_points && user?.points_balance) {
      pointsUsed = Math.min(
        user.points_balance,
        subtotal - discount
      );
    }

    /* CALCULATE FINAL PRICE */
    const final_price = Math.max(
      subtotal - discount - pointsUsed,
      0
    );

    /* SET TRANSACTION EXPIRY */
    const expired_at = new Date(
      Date.now() + 2 * 60 * 60 * 1000
    );

    /* CREATE TRANSACTION */
    const transaction = await tx.transactions.create({
      data: {
        user_id: userId,
        event_id: ticket.event_id!,
        total_price: subtotal,
        original_price: subtotal,
        discount_amount: discount + pointsUsed,
        final_price,
        status: "PENDING",
        expired_at,
        voucher_id: voucher_id || null,
      },
    });

    /* CREATE TRANSACTION ITEM */
    await tx.transaction_items.create({
      data: {
        transaction_id: transaction.id,
        ticket_id: ticket.id,
        quantity,
        price,
        subtotal,
      },
    });

    /* UPDATE TICKET SALES */
    await tx.tickets.update({
      where: { id: ticket.id },
      data: {
        sold: {
          increment: quantity,
        },
      },
    });

    /* DEDUCT USER POINTS */
    if (pointsUsed > 0) {
      await tx.users.update({
        where: { id: userId },
        data: {
          points_balance: {
            decrement: pointsUsed,
          },
        },
      });
    }

    return transaction;
  });
};