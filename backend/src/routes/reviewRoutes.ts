import { Router } from "express";

import {
  createReview,
  getEventReviews,
  getMyReview,
} from "../controllers/reviewController";

import {
  verifyToken,
} from "../middlewares/auth.middleware";

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

router.get(
  "/my/:eventId",
  verifyToken,
  getMyReview
);

export default router;