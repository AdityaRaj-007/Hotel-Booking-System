import { Hotel, Room } from "../../generated/prisma/client";
import { GlobalError } from "../../shared/utils/GlobalError";
import * as hotelRepository from "./hotels.repository";
import {
  AddHotelServiceInput,
  AddRoomInput,
  GetHotelDetails,
  GetHotelResult,
  HotelFilters,
} from "./hotels.types";

export const addHotel = async ({
  user,
  payload,
}: AddHotelServiceInput): Promise<Hotel> => {
  if (user.role !== "OWNER") {
    throw new GlobalError("FORBIDDEN", 403);
  }

  const userData = await hotelRepository.userExists(user.email);

  if (!userData) {
    throw new GlobalError("UNAUTHORIZED", 401);
  }

  const hotelData = await hotelRepository.createHotel(
    userData.id,
    payload.name,
    payload.description,
    payload.city,
    payload.country,
    payload.amenities,
  );

  return hotelData;
};

export const addRoom = async ({ hotelId, user, payload }: AddRoomInput) => {
  if (user.role !== "OWNER") {
    throw new GlobalError("FORBIDDEN", 403);
  }

  const hotel = await hotelRepository.findHotel(hotelId);

  if (!hotel) {
    throw new GlobalError("HOTEL_NOT_FOUND", 404);
  }

  const { roomNumber, roomType, pricePerNight, maxOccupancy } = payload;

  const roomExists = await hotelRepository.findRoom(hotelId, roomNumber);

  if (roomExists) {
    throw new GlobalError("ROOM_ALREADY_EXISTS", 400);
  }

  const roomData = await hotelRepository.addRoom(
    hotelId,
    roomNumber,
    roomType,
    pricePerNight,
    maxOccupancy,
  );

  return roomData;
};

export const getAllHotels = async (
  filters: HotelFilters,
): Promise<GetHotelResult[]> => {
  let hotels = await hotelRepository.getHotels(filters);
  hotels = hotels.filter((hotel) => hotel.rooms.length > 0);

  const response = hotels.map((hotel) => {
    const { rating, rooms, ...hotelData } = hotel;

    return {
      ...hotelData,
      amenities: hotel.amenities as string[],
      rating: rating.toNumber(),
      minPricePerNight: rooms[0]!.pricePerNight.toNumber(),
    };
  });

  return response;
};

export const getHotelDetails = async (
  hotelId: string,
): Promise<GetHotelDetails | null> => {
  const hotel = await hotelRepository.getHotel(hotelId);

  const response = {
    ...hotel,
    amenities: hotel!.amenities as string[],
    rating: hotel!.rating.toNumber(),
    rooms: hotel!.rooms?.map((room) => ({
      ...room,
      pricePerNight: room.pricePerNight.toNumber(),
    })),
  };

  return response;
};

export const getRoomDetails = async (roomId: string): Promise<Room | null> => {
  const room = await hotelRepository.getRoomDetails(roomId);

  return room;
};
