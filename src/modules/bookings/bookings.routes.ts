import Router from "express";
import { validate } from "../../shared/middleware/validationMiddleware";
import { AddBookingSchema, GetBookingSchema } from "./bookings.schema";
import { AddBooking, GetBookings } from "./bookings.controller";

const router = Router();

router.post("/", validate(AddBookingSchema), AddBooking);
router.get("/", validate(GetBookingSchema), GetBookings);

export default router;
