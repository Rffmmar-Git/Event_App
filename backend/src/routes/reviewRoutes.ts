import { Router } from "express";

import {
  createReview,
  getEventReviews,
} from "../controllers/reviewController";

import {
  verifyToken,
} from "../middleware/auth.middleware";

const router = Router();

/* PUBLIC */
router.get(
  "/event/:eventId",
  getEventReviews
);

/* PROTECTED */
router.post(
  "/",
  verifyToken,
  createReview
);

export default router;