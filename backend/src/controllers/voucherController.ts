import { Request, Response } from "express";

import {
  AuthRequest,
} from "../middlewares/auth.middleware";

import {
  createVoucherService,
  getEventVouchersService,
  updateVoucherService,
  deleteVoucherService,
} from "../services/voucher.service";

/* CREATE VOUCHER */
export const createVoucher = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const voucher =
      await createVoucherService(
        req.body,
        req.user!.id
      );

    return res.status(201).json({
      success: true,
      message:
        "Voucher created successfully",
      data: voucher,
    });
  } catch (error: any) {
    console.error(
      "CREATE VOUCHER ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create voucher",
    });
  }
};

/* GET EVENT VOUCHERS */
export const getEventVouchers =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const eventId = Number(
        req.params.eventId
      );

      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

      const vouchers =
        await getEventVouchersService(
          eventId
        );

      return res.status(200).json({
        success: true,
        data: vouchers,
      });
    } catch (error) {
      console.error(
        "GET VOUCHERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

/* UPDATE VOUCHER */
export const updateVoucher =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const voucherId = Number(
        req.params.id
      );

      const voucher =
        await updateVoucherService(
          voucherId,
          req.body,
          req.user!.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Voucher updated successfully",
        data: voucher,
      });
    } catch (error: any) {
      console.error(
        "UPDATE VOUCHER ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update voucher",
      });
    }
  };

/* DELETE VOUCHER */
export const deleteVoucher =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const voucherId = Number(
        req.params.id
      );

      await deleteVoucherService(
        voucherId,
        req.user!.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Voucher deleted successfully",
      });
    } catch (error: any) {
      console.error(
        "DELETE VOUCHER ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to delete voucher",
      });
    }
  };