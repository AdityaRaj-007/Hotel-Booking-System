import { AddBookingTypes, GetBooking } from "./bookings.types";
import * as bookingRepository from "./bookings.repository";
import * as hotelService from "../hotels/hotels.service";
import * as authService from "../auth/auth.service";

export const addBooking = async ({ user, payload }: AddBookingTypes) => {
  const bookingExists = await bookingRepository.bookingExists(
    payload.roomId,
    payload.checkInDate,
    payload.checkOutDate,
  );

  console.log("Prev Bookings" + bookingExists);

  if (bookingExists.length > 0) {
    throw new Error("ROOM_NOT_AVAILABLE");
  }

  const room = await hotelService.getRoomDetails(payload.roomId);

  if (!room) {
    throw new Error("ROOM_NOT_FOUND");
  }

  if (payload.guests > room.maxOccupancy) {
    throw new Error("INVALID_CAPACITY");
  }

  if (new Date(payload.checkInDate) < new Date()) {
    throw new Error("INVALID_DATES");
  }

  const userData = await authService.findUser(user.email);

  if (!userData) {
    throw new Error("FORBIDDEN");
  }

  const hotel = await hotelService.getHotelDetails(room.hotelId);

  if (!hotel) {
    throw new Error("HOTEL_NOT_FOUND");
  }

  if (userData.id === hotel.ownerId) {
    throw new Error("FORBIDDEN");
  }

  const nights =
    (new Date(payload.checkOutDate).getTime() -
      new Date(payload.checkInDate).getTime()) /
    (1000 * 60 * 60 * 24);
  const totalPrice = nights * room.pricePerNight.toNumber();

  const booking = await bookingRepository.createBooking(
    userData.id,
    payload.roomId,
    payload.checkInDate,
    payload.checkOutDate,
    payload.guests,
    totalPrice,
    room.hotelId,
  );

  return booking;
};

export const getBookingDetails = async ({ user, status }: GetBooking) => {
  const userData = await authService.findUser(user.email);

  if (!userData) {
    throw new Error("UNAUTHORIZED");
  }

  const allUserBookings = await bookingRepository.getUserBookings(
    userData.id,
    status,
  );

  const bookingLists = allUserBookings.map((booking) => {
    const { cancelledAt, room, hotel, ...bookingData } = {
      ...booking,
      roomNumber: booking.room.roomNumber,
      roomType: booking.room.roomType,
      hotelName: booking.hotel.name,
      checkInDate: booking.checkInDate.toISOString().slice(0, 10),
      checkOutDate: booking.checkOutDate.toISOString().slice(0, 10),
      totalPrice: booking.totalPrice.toNumber(),
    };

    return bookingData;
  });

  return bookingLists;
};
