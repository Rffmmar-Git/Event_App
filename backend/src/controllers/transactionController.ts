import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/prisma";
import { createTransactionService, getOrganizerTransactionsService, approveTransactionService, rejectTransactionService  } from "../services/transaction.service";


/* CREATE TRANSACTION */
export const createTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { ticket_id, quantity } = req.body;

    /* VALIDATE INPUT */
    if (!ticket_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "ticket_id and quantity are required",
      });
    }

    /* CREATE TRANSACTION */
    const transaction = await createTransactionService(
      req.body,
      req.user!.id
    );

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error: any) {
    console.error("Create transaction error:", error);

    /* HANDLE KNOWN ERRORS */
    const knownErrors = [
      "Invalid input",
      "Ticket not found",
      "Not enough seats",
      "Voucher not found",
      "Voucher expired",
      "Voucher quota exceeded",
    ];

    if (knownErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    /* SERVER ERROR */
    return res.status(500).json({
      success: false,
      message: "Transaction failed",
    });
  }
};

/* UPLOAD PAYMENT PROOF */
export const uploadPaymentProof = async (
  req: Request,
  res: Response
) => {
  try {
    const transactionId = Number(req.params.id);

    /* VALIDATE ID */
    if (Number.isNaN(transactionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction id",
      });
    }

    /* CHECK FILE */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment proof is required",
      });
    }

    const paymentProof = `/uploads/${req.file.filename}`;

    /* UPDATE TRANSACTION */
    const transaction = await prisma.transactions.update({
      where: {
        id: transactionId,
      },
      data: {
        payment_proof: paymentProof,
        status: "WAITING_CONFIRMATION",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Upload payment proof error:", error);

    /* SERVER ERROR */
    return res.status(500).json({
      success: false,
      message: "Failed to upload payment proof",
    });
  }
};

/* GET USER TRANSACTIONS */
export const getTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    /* FETCH TRANSACTIONS */
    const transactions = await prisma.transactions.findMany({
      where: {
        user_id: req.user!.id,
      },
      include: {
        transaction_items: {
          include: {
            tickets: true,
          },
        },
        events: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    /* SERVER ERROR */
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

/* GET ORGANIZER TRANSACTIONS */
export const getOrganizerTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const transactions =
      await getOrganizerTransactionsService(
        req.user!.id
      );

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error(
      "Get organizer transactions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch organizer transactions",
    });
  }
};

/* APPROVE TRANSACTION */
export const approveTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const transactionId =
      Number(req.params.id);

    const transaction =
      await approveTransactionService(
        transactionId
      );

    return res.status(200).json({
      success: true,
      message:
        "Transaction approved",
      data: transaction,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
};

/* REJECT TRANSACTION */
export const rejectTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const transactionId =
      Number(req.params.id);

    const transaction =
      await rejectTransactionService(
        transactionId
      );

    return res.status(200).json({
      success: true,
      message:
        "Transaction rejected",
      data: transaction,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
};

/* GET TRANSACTION BY ID */
export const getTransactionById = async (
  req: Request,
  res: Response
) => {
  try {
    const transactionId = Number(req.params.id);

    /* VALIDATE ID */
    if (Number.isNaN(transactionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction id",
      });
    }

    /* FIND TRANSACTION */
    const transaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        transaction_items: {
          include: {
            tickets: true,
          },
        },
        events: true,
      },
    });

    /* TRANSACTION NOT FOUND */
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Get transaction detail error:", error);

    /* SERVER ERROR */
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
    });
  }
};