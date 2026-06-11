import z from "zod";
import { BookingStatus, Role } from "../../generated/prisma/enums";
import { CancellingBookingSchema, GetBookingSchema } from "./bookings.schema";

export type AddBookingTypes = {
  user: {
    email: string;
    role: Role;
  };
  payload: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
  };
};

export type GetBooking = {
  user: {
    email: string;
    role: Role;
  };
  status?: BookingStatus;
};

export type CancelBooking = {
  user: {
    email: string;
    role: Role;
  };
  bookingId: string;
};

export type GetBookingStatus = z.infer<typeof GetBookingSchema>["query"];
export type CancelBookingParams = z.infer<
  typeof CancellingBookingSchema
>["params"];
