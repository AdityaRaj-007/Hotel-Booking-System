import { BookingStatus, Role } from "../../generated/prisma/enums";
import { prisma } from "../../infrastructure/db";

export const bookingExists = async (
  roomId: string,
  checkInDate: string,
  checkOutDate: string,
) => {
  const checkIn = new Date(checkInDate).toISOString();
  const checkOut = new Date(checkOutDate).toISOString();
  const booking = await prisma.booking.findMany({
    where: {
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      status: "CONFIRMED",
    },
  });

  return booking;
};

export const createBooking = async (
  userId: string,
  roomId: string,
  checkInDate: string,
  checkOutDate: string,
  guests: number,
  totalPrice: number,
  hotelId: string,
) => {
  const checkIn = new Date(checkInDate).toISOString();
  const checkOut = new Date(checkOutDate).toISOString();
  const newBooking = await prisma.booking.create({
    data: {
      userId,
      roomId,
      hotelId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalPrice,
    },
  });

  return newBooking;
};

export const getUserBookings = async (
  userId: string,
  status: BookingStatus | undefined,
) => {
  if (!status) {
    const bookings = prisma.booking.findMany({
      where: { userId },
      include: {
        hotel: { select: { name: true } },
        room: { select: { roomNumber: true, roomType: true } },
      },
    });
    return bookings;
  }

  return await prisma.booking.findMany({
    where: { userId, status },
    include: {
      hotel: { select: { name: true } },
      room: { select: { roomNumber: true, roomType: true } },
    },
  });
};

export const getBookingDetails = async (bookingId: string) => {
  return await prisma.booking.findUnique({ where: { id: bookingId } });
};

export const cancelBooking = async (bookingId: string) => {
  return await prisma.booking.updateManyAndReturn({
    where: { id: bookingId },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
};
