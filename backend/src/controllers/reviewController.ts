import { Response } from "express";

import {
  AuthRequest,
} from "../middleware/auth.middleware";

import {
  createReviewService,
  getEventReviewsService,
  getUserReviewService,
} from "../services/review.service";

/* CREATE REVIEW */
export const createReview =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const review =
        await createReviewService(
          req.user!.id,
          req.body
        );

      return res.status(201).json({
        success: true,
        message:
          "Review created successfully",
        data: review,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* GET EVENT REVIEWS */
export const getEventReviews =
  async (
    req: any,
    res: Response
  ) => {
    try {
      const eventId = Number(
        req.params.eventId
      );

      const reviews =
        await getEventReviewsService(
          eventId
        );

      return res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch reviews",
      });
    }
  };

  /* GET MY REVIEW */
export const getMyReview = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const eventId = Number(
      req.params.eventId
    );

    const review =
      await getUserReviewService(
        req.user!.id,
        eventId
      );

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch review",
    });
  }
};