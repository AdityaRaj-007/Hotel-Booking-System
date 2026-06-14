import { NextFunction, Request, Response } from "express";
import { GlobalError } from "../utils/GlobalError";

export const errorMiddleware = (
  err: GlobalError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode;
  const message = err.message;

  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
};
