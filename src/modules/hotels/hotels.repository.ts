import { omit } from "zod/mini";
import { HotelWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../infrastructure/db";
import { HotelFilters } from "./hotels.types";

export const userExists = async (email: string) => {
  const userData = await prisma.user.findUnique({ where: { email } });

  return userData;
};

export const createHotel = async (
  ownerId: string,
  name: string,
  description: string,
  city: string,
  country: string,
  amenities: string[],
) => {
  const hotelData = await prisma.hotel.create({
    data: {
      ownerId,
      name,
      description,
      city,
      country,
      amenities,
    },
  });

  return hotelData;
};

export const findHotel = async (hotelId: string) => {
  return await prisma.hotel.findUnique({ where: { id: hotelId } });
};

export const addRoom = async (
  hotelId: string,
  roomNumber: string,
  roomType: string,
  pricePerNight: number,
  maxOccupancy: number,
) => {
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

  if (!hotel) {
    throw new Error("Hotel doesn't exists");
  }

  const roomData = await prisma.room.create({
    data: {
      hotelId,
      roomNumber,
      roomType,
      pricePerNight,
      maxOccupancy,
    },
  });

  return roomData;
};

export const findRoom = async (roomNumber: string, hotelId: string) => {
  const room = await prisma.room.findUnique({
    where: { hotelId_roomNumber: { roomNumber, hotelId } },
  });

  return room;
};

export const getHotels = async (filters: HotelFilters) => {
  const { city, country, minPrice, maxPrice, minRating } = filters;

  const where: HotelWhereInput = {};

  if (city) {
    where.city = city;
  }

  if (country) {
    where.country = country;
  }

  if (minRating !== undefined) {
    where.rating = {
      gte: minRating,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.rooms = {
      some: {
        pricePerNight: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      },
    };
  }

  const hotels = await prisma.hotel.findMany({
    where,
    omit: { createdAt: true },
    include: {
      rooms: {
        orderBy: {
          pricePerNight: "asc",
        },
        take: 1,
        select: {
          pricePerNight: true,
        },
      },
    },
  });
  return hotels;
};

export const getHotel = async (hotelId: string) => {
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
    omit: { createdAt: true },
    include: {
      rooms: {
        omit: {
          createdAt: true,
        },
      },
    },
  });
};

export const getRoomDetails = async (roomId: string) => {
  return await prisma.room.findUnique({ where: { id: roomId } });
};
