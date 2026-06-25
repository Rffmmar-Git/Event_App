import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware";

import { getMyCoupons } from "../controllers/coupon.controller";

const router = Router();

router.get(
  "/my-coupons",
  verifyToken,
  getMyCoupons
);

export default router;