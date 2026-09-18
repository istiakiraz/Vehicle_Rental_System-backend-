import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { AuthUser } from "../../types/express";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
      details: err,
    });
  }
};

const getAllBooking = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await bookingServices.getAllBooking(
      loggedInUser.id,
      loggedInUser.role,
    );

    res.status(200).json({
      success: true,
      message:
        loggedInUser.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBooking
};
