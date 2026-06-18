import express from "express";

import {
  createTransaction,
  uploadPaymentProof,
  getTransactions,
  getTransactionById,
} from "../controllers/transactionController";

import { upload } from "../middleware/upload";

import {
  verifyToken,
} from "../middleware/auth.middleware";

const router = express.Router();

/* PROTECTED ROUTES */
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

router.get(
  "/:id",
  verifyToken,
  getTransactionById
);

export default router;