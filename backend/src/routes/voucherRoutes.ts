import { Router } from "express";

import {
  createVoucher,
  getEventVouchers,
  updateVoucher,
  deleteVoucher,
} from "../controllers/voucherController";

import {
  verifyToken,
} from "../middleware/auth.middleware";

const router = Router();

/* PUBLIC */
router.get(
  "/event/:eventId",
  getEventVouchers
);

/* PROTECTED */
router.post(
  "/",
  verifyToken,
  createVoucher
);

router.patch(
  "/:id",
  verifyToken,
  updateVoucher
);

router.delete(
  "/:id",
  verifyToken,
  deleteVoucher
);

export default router;