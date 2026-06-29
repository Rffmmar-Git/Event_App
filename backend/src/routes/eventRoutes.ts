import { Router } from "express";

import {
  getEvents,
  getEventById,
  getEventForEdit,
  createEvent,
  getMyEvents,
  updateEvent,
  getEventAttendees,
  deleteEvent,
} from "../controllers/eventController";

import {
  verifyToken,
} from "../middlewares/auth.middleware";

import { bannerUpload } from "../middlewares/bannerUpload";

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
  bannerUpload.single("banner"),
  createEvent
);

router.patch(
  "/:id",
  verifyToken,
  bannerUpload.single("banner"),
  updateEvent
);

router.delete(
  "/:id",
  verifyToken,
  deleteEvent
);

router.get(
  "/:id/attendees",
  verifyToken,
  getEventAttendees
);

router.get(
  "/:id/edit",
  verifyToken,
  getEventForEdit
);

router.get("/:id", getEventById);

export default router;