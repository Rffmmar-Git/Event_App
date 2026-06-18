import { Request, Response } from "express";

import {
  registerService,
  loginService,
} from "../services/auth.service";

/* REGISTER */
export const register = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(
      "REGISTER BODY:",
      req.body
    );
    
    const user =
      await registerService(req.body);

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    console.error(
      "REGISTER ERROR:",
      error
    );

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
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        error.message ||
        "Login failed",
    });
  }
};