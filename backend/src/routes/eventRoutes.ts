import { Router } from "express";

import {
  getEvents,
  getEventById,
  createEvent,
} from "../controllers/eventController";

import {
  verifyToken,
} from "../middleware/auth.middleware";
const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", verifyToken, createEvent); 

export default router;