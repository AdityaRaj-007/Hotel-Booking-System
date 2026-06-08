import z from "zod";
import { Role } from "../../generated/prisma/enums";
import { AddRoomSchema, GetHotelDetailsSchema } from "./hotels.schema";

export type AddHotelServiceInput = {
  user: {
    email: string;
    role: Role;
  };
  payload: {
    name: string;
    description: string;
    city: string;
    country: string;
    amenities: string[];
  };
};

export type AddRoomInput = {
  hotelId: string;
  user: {
    email: string;
    role: Role;
  };
  payload: {
    roomNumber: string;
    roomType: string;
    pricePerNight: number;
    maxOccupancy: number;
  };
};

export type HotelFilters = {
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};

export type GetHotelResult = {
  id: string;
  name: string;
  description: string | null;
  city: string;
  country: string;
  amenities: string[];
  rating: number;
  totalReviews: number;
  minPricePerNight: number;
};

export type GetHotelDetails = {
  id?: string;
  ownerId?: string;
  name?: string;
  description?: string | null;
  city?: string;
  country?: string;
  amenities?: string[];
  rating?: number;
  totalReviews?: number;
  rooms?: {
    id?: string;
    hotelId?: string;
    roomNumber?: string;
    roomType?: string;
    pricePerNight?: number;
    maxOccupancy?: number;
  }[];
};

export type AddRoomBody = z.infer<typeof AddRoomSchema>["body"];
export type AddRoomParams = z.infer<typeof AddRoomSchema>["params"];
export type GetHotelParams = z.infer<typeof GetHotelDetailsSchema>["params"];
