import { Request, Response } from "express";

import {
  AuthRequest,
} from "../middleware/auth.middleware";

import {
  getAllEvents,
  getEventByIdService,
  createEventService,
  getMyEventsService,
  updateEventService,
  getEventAttendeesService,
  deleteEventService,
} from "../services/event.service";

/* GET ALL EVENTS */
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents(req.query);

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* GET EVENT BY ID */
export const getEventById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await getEventByIdService(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("GET EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* GET MY EVENTS */
export const getMyEvents = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const events =
      await getMyEventsService(
        req.user!.id
      );

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error(
      "GET MY EVENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};

/* CREATE EVENT */
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    console.log(
      "Logged in user:",
      req.user
    );

    const newEvent = await createEventService(req.body, req.user!.id, req.file);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error: any) {
    console.error("CREATE EVENT ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};

/* UPDATE EVENT */
export const updateEvent = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const eventId = Number(
      req.params.id
    );

    const updatedEvent = await updateEventService(
      eventId,
      req.user!.id,
      req.body,
      req.file,
    );

    return res.status(200).json({
      success: true,
      message:
        "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update event",
    });
  }
};

/* GET EVENT ATTENDEES */
export const getEventAttendees =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const eventId = Number(
        req.params.id
      );

      const attendees =
        await getEventAttendeesService(
          eventId,
          req.user!.id
        );

      return res.status(200).json({
        success: true,
        data: attendees,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  /* DELETE EVENT */
export const deleteEvent = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const eventId = Number(
      req.params.id
    );

    await deleteEventService(
      eventId,
      req.user!.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Event deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to delete event",
    });
  }
};