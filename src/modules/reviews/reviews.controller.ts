import { NextFunction, Response } from "express";
import { AuthRequest } from "../../shared/middleware/authMiddleware";
import * as reviewService from "./reviews.service";

export const AddReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: true, data: null, error: "UNAUTHORIZED" });
    }

    const payload = req.body;

    const review = await reviewService.AddReviewToBooking({ user, payload });

    return res.status(201).json({
      success: true,
      data: review,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: (err as Error).message,
    });
  }
};
