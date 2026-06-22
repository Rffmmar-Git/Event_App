import express from "express";

import {
  createTransaction,
  uploadPaymentProof,
  getTransactions,
  getTransactionById,
  getOrganizerTransactions,
  approveTransaction,
  rejectTransaction,
} from "../controllers/transactionController";

import { upload } from "../middleware/upload";

import {
  verifyToken,
} from "../middleware/auth.middleware";

const router = express.Router();

/* ORGANIZER ROUTES */
router.get(
  "/organizer",
  verifyToken,
  getOrganizerTransactions
);

/* CUSTOMER ROUTES */
router.get(
  "/",
  verifyToken,
  getTransactions
);

router.post(
  "/",
  verifyToken,
  createTransaction
);

router.patch(
  "/:id/payment-proof",
  verifyToken,
  upload.single("payment_proof"),
  uploadPaymentProof
);

router.patch(
  "/:id/approve",
  verifyToken,
  approveTransaction
);

router.patch(
  "/:id/reject",
  verifyToken,
  rejectTransaction
);

router.get(
  "/:id",
  verifyToken,
  getTransactionById
);

export default router;