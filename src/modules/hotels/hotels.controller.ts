import { NextFunction, Response } from "express";
import * as hotelService from "./hotels.service";
import { AuthRequest } from "../../shared/middleware/authMiddleware";
import { AddRoomBody, AddRoomParams, GetHotelParams } from "./hotels.types";
import * as authRepository from "../auth/auth.repository";
import { success } from "zod";

export const AddHotel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotel = await hotelService.addHotel({
      user: req.user!,
      payload: req.body,
    });

    const { createdAt, ...hotelData } = hotel;

    return res.status(201).json({
      success: true,
      data: { ...hotelData, rating: hotelData.rating.toNumber() },
      error: null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      data: {},
      error: (err as Error).message,
    });
  }
};

export const AddRoomInHotel = async (
  req: AuthRequest<AddRoomParams, {}, AddRoomBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await hotelService.getHotelDetails(hotelId);

    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, data: {}, error: "HOTEL_NOT_FOUND" });
    }

    const user = await authRepository.findUserByEmail(req.user!.email);

    if (!user) {
      return res
        .status(403)
        .json({ success: false, data: {}, error: "USER_NOT_FOUND" });
    }

    if (hotel.ownerId !== user.id) {
      return res
        .status(403)
        .json({ success: false, data: {}, error: "FORBIDDEN" });
    }
    const room = await hotelService.addRoom({
      hotelId: req.params.hotelId,
      payload: req.body,
      user: req.user!,
    });

    const { createdAt, ...roomData } = room;

    return res.status(201).json({
      success: true,
      data: roomData,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      error: (err as Error).message,
    });
  }
};

export const GetAllHotels = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotels = await hotelService.getAllHotels(req.query);

    return res.status(200).json({
      success: true,
      data: hotels,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      error: (err as Error).message,
    });
  }
};

export const GetHotelDetails = async (
  req: AuthRequest<GetHotelParams, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotel = await hotelService.getHotelDetails(req.params.hotelId);

    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, data: {}, error: "HOTEL_NOT_FOUND" });
    }

    return res.status(200).json({ success: true, data: hotel, error: null });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      error: (err as Error).message,
    });
  }
};
