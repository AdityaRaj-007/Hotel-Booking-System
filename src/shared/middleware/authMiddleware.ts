import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { GlobalError } from "../utils/GlobalError";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AuthRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    email: string;
    role: Role;
  };
}

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new GlobalError("UNAUTHORIZED", 401));
  }
  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    return next(new GlobalError("UNAUTHORIZED", 401));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      role: Role;
    };
    console.log(decoded);

    req.user = decoded;
    next();
  } catch (err) {
    return next(new GlobalError("UNAUTHORIZED", 401));
  }
};
