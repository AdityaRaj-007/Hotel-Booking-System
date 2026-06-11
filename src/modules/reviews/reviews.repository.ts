import { prisma } from "../../infrastructure/db";

export const findReview = async (userId: string, bookingId: string) => {
  return await prisma.review.findUnique({
    where: { userId_bookingId: { userId, bookingId } },
  });
};

export const createReview = async (
  userId: string,
  hotelId: string,
  bookingId: string,
  rating: number,
  comment: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const noOfReviews = await tx.review.findMany({ where: { hotelId } });

    const review = await tx.review.create({
      data: { userId, hotelId, bookingId, rating, comment },
    });

    const hotel = await tx.hotel.findUniqueOrThrow({
      where: { id: hotelId },
      select: { rating: true },
    });

    const currentRating = hotel.rating.toNumber();

    const newRating =
      (currentRating * noOfReviews.length + rating) / (noOfReviews.length + 1);

    await tx.hotel.update({
      where: { id: hotelId },
      data: { rating: newRating },
    });

    return review;
  });
};
