import { Router } from "express";

import {
  register,
  login,
} from "../controllers/authController";

import { 
    verifyToken,
    AuthRequest,
 } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/register",
  register
);

router.get(
  "/me",
  verifyToken,
  (
    req: AuthRequest,
    res
  ) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

router.post(
  "/login",
  login
);

export default router;