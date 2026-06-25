import { Router } from "express";

import {
  getOrganizerAnalytics,
} from "../controllers/analyticsController";

import {
  verifyToken,
} from "../middlewares/auth.middleware";

const router = Router();

/* ORGANIZER ANALYTICS */
router.get(
  "/",
  verifyToken,
  getOrganizerAnalytics
);

export default router;