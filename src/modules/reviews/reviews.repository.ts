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
  return await prisma.review.create({
    data: { userId, hotelId, bookingId, rating, comment },
  });
};
