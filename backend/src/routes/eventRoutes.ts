import { Router } from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
} from "../controllers/eventController";

import {
  verifyToken,
} from "../middleware/auth.middleware";

const router = Router();

/* PUBLIC ROUTES */
router.get("/", getEvents);

/* PROTECTED ROUTES */
router.get(
  "/my-events",
  verifyToken,
  getMyEvents
);

router.post(
  "/",
  verifyToken,
  createEvent
);

router.patch(
  "/:id",
  verifyToken,
  updateEvent
);

router.get("/:id", getEventById);

export default router;