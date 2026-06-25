import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";

import {
  getOrganizerAnalyticsService,
} from "../services/analytics.service";

/* GET ORGANIZER ANALYTICS */
export const getOrganizerAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const analytics =
      await getOrganizerAnalyticsService(
        req.user!.id
      );

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(
      "GET ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load analytics",
    });
  }
};