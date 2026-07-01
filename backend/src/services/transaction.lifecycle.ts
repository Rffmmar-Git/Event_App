import prisma from "../config/prisma";

/* EXPIRE TRANSACTIONS */
export const expireTransactions = async () => {
  const now = new Date();

  /* FIND EXPIRED TRANSACTIONS */
  const expiredTransactions = await prisma.transactions.findMany({
    where: {
      status: "WAITING_FOR_PAYMENT",
      expired_at: {
        lte: now,
      },
    },

    include: {
      transaction_items: true,

      users: {
        select: {
          id: true,
        },
      },
    },
  });

  /* PROCESS EXPIRED TRANSACTIONS */
  for (const trx of expiredTransactions) {
    /* RESTORE TICKET QUOTA */
    for (const item of trx.transaction_items) {
      await prisma.tickets.update({
        where: {
          id: item.ticket_id!,
        },
        data: {
          sold: {
            decrement: item.quantity!,
          },
        },
      });
    }

    /* REFUND USER POINTS */
    if (trx.user_id && (trx.points_used ?? 0) > 0) {
      await prisma.users.update({
        where: {
          id: trx.user_id,
        },
        data: {
          points_balance: {
            increment: trx.points_used ?? 0,
          },
        },
      });
    }

    /* UPDATE TRANSACTION STATUS */
    await prisma.transactions.update({
      where: {
        id: trx.id,
      },
      data: {
        status: "EXPIRED",
      },
    });
  }

  /* LOG RESULT */
  console.log(`Expired ${expiredTransactions.length} transactions`);
};

/* AUTO CANCEL TRANSACTIONS */
export const autoCancelTransactions = async () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  /* FIND OLD PENDING TRANSACTIONS */
  const transactions = await prisma.transactions.findMany({
    where: {
      status: "WAITING_CONFIRMATION",
      updated_at: {
        lte: threeDaysAgo,
      },
    },

    include: {
      transaction_items: true,
    },
  });

  /* PROCESS TRANSACTIONS */
  for (const trx of transactions) {
    /* RESTORE TICKET QUOTA */
    for (const item of trx.transaction_items) {
      await prisma.tickets.update({
        where: {
          id: item.ticket_id!,
        },
        data: {
          sold: {
            decrement: item.quantity!,
          },
        },
      });
    }

    /* REFUND USER POINTS */
    if (trx.user_id && (trx.points_used ?? 0) > 0) {
      await prisma.users.update({
        where: {
          id: trx.user_id,
        },
        data: {
          points_balance: {
            increment: trx.points_used ?? 0,
          },
        },
      });
    }

    /* UPDATE TRANSACTION STATUS */
    await prisma.transactions.update({
      where: {
        id: trx.id,
      },
      data: {
        status: "CANCELED",
      },
    });
  }

  /* LOG RESULT */
  console.log(`Canceled ${transactions.length} transactions`);
};
