import { AddReview } from "./reviews.types";
import * as authService from "../auth/auth.service";
import * as bookingService from "../bookings/bookings.service";
import * as reviewsRepository from "./reviews.repository";
import { GlobalError } from "../../shared/utils/GlobalError";

export const AddReviewToBooking = async ({ user, payload }: AddReview) => {
  const userData = await authService.findUser(user.email);

  if (!userData) {
    throw new Error("UNAUTHORIZED");
  }

  const bookingData = await bookingService.getBookingDetail(payload.bookingId);

  if (!bookingData) {
    throw new GlobalError("BOOKING_NOT_FOUND", 404);
  }

  if (userData.id !== bookingData.userId) {
    throw new GlobalError("FORBIDDEN", 403);
  }

  const reviewExists = await reviewsRepository.findReview(
    userData.id,
    payload.bookingId,
  );

  if (reviewExists) {
    throw new GlobalError("ALREADY_REVIEWED", 400);
  }

  const todaysDate = new Date();

  if (
    todaysDate < new Date(bookingData.checkOutDate) ||
    bookingData.status === "CANCELLED"
  ) {
    throw new GlobalError("BOOKING_NOT_ELIGIBLE", 400);
  }

  const review = await reviewsRepository.createReview(
    userData.id,
    bookingData.hotelId,
    bookingData.id,
    payload.rating,
    payload.comment,
  );

  console.log(review);

  return review;
};
