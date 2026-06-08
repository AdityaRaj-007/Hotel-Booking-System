import Router from "express";
import { validate } from "../../shared/middleware/validationMiddleware";
import {
  AddHotelSchema,
  AddRoomSchema,
  GetHotelDetailsSchema,
} from "./hotels.schema";
import {
  AddHotel,
  AddRoomInHotel,
  GetAllHotels,
  GetHotelDetails,
} from "./hotels.controller";

const router = Router();

router.post("/", validate(AddHotelSchema), AddHotel);
router.post("/:hotelId/rooms", validate(AddRoomSchema), AddRoomInHotel);
router.get("/", GetAllHotels);
router.get("/:hotelId", validate(GetHotelDetailsSchema), GetHotelDetails);

export default router;
