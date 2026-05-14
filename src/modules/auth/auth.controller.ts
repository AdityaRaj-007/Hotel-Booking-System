import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import { success } from "zod";

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.signup(req.body);

    return res.status(201).json({
      success: true,
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        phone: result.phone,
      },
      error: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      data: {},
      error: (err as Error).message,
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { existingUser, token } = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      },
      error: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      data: {},
      error: (err as Error).message,
    });
  }
};
