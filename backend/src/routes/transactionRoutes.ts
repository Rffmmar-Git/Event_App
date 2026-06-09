import express from "express";

import {
  createTransaction,
  uploadPaymentProof,
  getTransactions,
  getTransactionById,
} from "../controllers/transactionController";

import { upload } from "../middleware/upload";

const router = express.Router();

router.get("/", getTransactions);

router.get("/:id", getTransactionById);

router.post("/", createTransaction);

router.patch(
  "/:id/payment-proof",
  upload.single("payment_proof"),
  uploadPaymentProof
);

export default router;