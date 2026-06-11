import { AddReview } from "./reviews.types";
import * as authService from "../auth/auth.service";
import * as bookingService from "../bookings/bookings.service";
import * as reviewsRepository from "./reviews.repository";

export const AddReviewToBooking = async ({ user, payload }: AddReview) => {
  const userData = await authService.findUser(user.email);

  if (!userData) {
    throw new Error("UNAUTHORIZED");
  }

  const bookingData = await bookingService.getBookingDetail(payload.bookingId);

  if (!bookingData) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  if (userData.id !== bookingData.userId) {
    throw new Error("FORBIDDEN");
  }

  const reviewExists = await reviewsRepository.findReview(
    userData.id,
    payload.bookingId,
  );

  if (reviewExists) {
    throw new Error("ALREADY_REVIEWED");
  }

  const todaysDate = new Date();

  if (
    todaysDate < new Date(bookingData.checkOutDate) ||
    bookingData.status === "CANCELLED"
  ) {
    throw new Error("BOOKING_NOT_ELIGIBLE");
  }

  const review = await reviewsRepository.createReview(
    userData.id,
    bookingData.hotelId,
    bookingData.id,
    payload.rating,
    payload.comment,
  );

  return review;
};
