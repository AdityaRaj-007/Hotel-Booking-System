import z from "zod";

export const AddHotelSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    city: z.string(),
    country: z.string(),
    amenities: z.array(z.string()),
  }),
});

export const AddRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string(),
    roomType: z.string(),
    pricePerNight: z.number().positive(),
    maxOccupancy: z.number().int(),
  }),
  params: z.object({
    hotelId: z.string(),
  }),
});

export const GetHotelDetailsSchema = z.object({
  params: z.object({
    hotelId: z.string(),
  }),
});
