import { Response } from "express";

import { getMyCouponsService } from "../services/coupon.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getMyCoupons = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const coupons =
      await getMyCouponsService(userId);

    return res.json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};