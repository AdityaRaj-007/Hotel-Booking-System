import { NextFunction, Response } from "express";
import { AuthRequest } from "../../shared/middleware/authMiddleware";
import * as bookingService from "./bookings.service";
import { CancelBookingParams, GetBookingStatus } from "./bookings.types";

export const AddBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const booking = await bookingService.addBooking({
      user: req.user!,
      payload: req.body,
    });

    const { cancelledAt, ...bookingData } = {
      ...booking,
      checkInDate: booking.checkInDate.toISOString().slice(0, 10),
      checkOutDate: booking.checkOutDate.toISOString().slice(0, 10),
      totalPrice: booking.totalPrice.toNumber(),
    };

    return res
      .status(201)
      .json({ success: true, data: bookingData, error: null });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const GetBookings = async (
  req: AuthRequest<{}, {}, {}, GetBookingStatus>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: "UNAUTHORIZED",
      });
    }

    if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        data: null,
        error: "FORBIDDEN",
      });
    }
    const user = req.user;
    const status = req.query.status;

    const bookingList = await bookingService.getBookingDetails({
      user,
      ...(status && { status }),
    });

    return res.status(200).json({
      success: true,
      data: bookingList,
      error: null,
    });
  } catch (err) {
    return next(err);
  }
};

export const CancelBooking = async (
  req: AuthRequest<CancelBookingParams, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: "UNAUTHORIZED",
      });
    }

    const bookingId = req.params.bookingId;
    const bookingStatus = await bookingService.cancelBooking({
      user: req.user,
      bookingId,
    });

    console.log(bookingStatus);

    return res.status(200).json({
      success: true,
      data: bookingStatus,
      error: false,
    });
  } catch (err) {
    return next(err);
  }
};
