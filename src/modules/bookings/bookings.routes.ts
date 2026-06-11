import Router from "express";
import { validate } from "../../shared/middleware/validationMiddleware";
import {
  AddBookingSchema,
  CancellingBookingSchema,
  GetBookingSchema,
} from "./bookings.schema";
import { AddBooking, CancelBooking, GetBookings } from "./bookings.controller";

const router = Router();

router.post("/", validate(AddBookingSchema), AddBooking);
router.get("/", validate(GetBookingSchema), GetBookings);
router.put(
  "/:bookingId/cancel",
  validate(CancellingBookingSchema),
  CancelBooking,
);

export default router;
