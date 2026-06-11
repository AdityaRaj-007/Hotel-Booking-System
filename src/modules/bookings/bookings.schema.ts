import z from "zod";
import { BookingStatus } from "../../generated/prisma/enums";

export const AddBookingSchema = z.object({
  body: z.object({
    roomId: z.string(),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    guests: z.number(),
  }),
});

export const GetBookingSchema = z.object({
  query: z.object({
    status: z.enum(BookingStatus).optional(),
  }),
});
