import { Request, Response } from "express";

import {
  registerService,
  loginService,
  updateProfileService,
  changePasswordService,
} from "../services/auth.service";

import { AuthRequest } from "../middlewares/auth.middleware";

/* REGISTER */
export const register = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const user = await registerService(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Registration failed",
    });
  }
};

/* LOGIN */
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await loginService(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return res.status(401).json({
      success: false,
      message:
        error.message ||
        "Login failed",
    });
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const profilePicture =
      req.file?.filename;

    const user =
      await updateProfileService(
        req.user!.id,
        req.body,
        profilePicture
      );

    return res.json({
      success: true,
      message:
        "Profile updated successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* CHANGE PASSWORD */
export const changePassword = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      current_password,
      new_password,
    } = req.body;

    await changePasswordService(
      req.user!.id,
      current_password,
      new_password
    );

    return res.json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};