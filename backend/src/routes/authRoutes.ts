import { Router } from "express";
import prisma from "../config/prisma";

import {
  register,
  login,
  updateProfile,
  changePassword,
} from "../controllers/authController";

import {
  verifyToken,
  AuthRequest,
} from "../middlewares/auth.middleware";

import { profileUpload } from "../middlewares/profileUpload";

const router = Router();

/* REGISTER */
router.post("/register", register);

/* LOGIN */
router.post("/login", login);

/* CURRENT USER */
router.get(
  "/me",
  verifyToken,
  async (req: AuthRequest, res) => {
    const user = await prisma.users.findUnique({
      where: {
        id: req.user!.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points_balance: true,
        referral_code: true,
        profile_picture: true,
      },
    });

    res.json({
      success: true,
      user,
    });
  }
);

/* UPDATE PROFILE */
router.put(
  "/profile",
  verifyToken,
  profileUpload.single("profile_picture"),
  updateProfile
);

/* CHANGE PASSWORD */
router.put(
  "/change-password",
  verifyToken,
  changePassword
);

export default router;