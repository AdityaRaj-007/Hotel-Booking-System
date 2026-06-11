import { NextFunction, Request, Response } from "express";
import { success, ZodError, ZodType } from "zod";

type ValidationSchema = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export const validate =
  <T extends ValidationSchema>(schema: ZodType<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (validatedData.body) {
        req.body = validatedData.body;
      }

      if (validatedData.query) {
        Object.assign(req.query, validatedData.query);
      }

      if (validatedData.params) {
        req.params = validatedData.params as Request["params"];
      }

      next();
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          data: null,
          errors: "INVALID_REQUEST",
        });
      }

      return res.status(500).json({
        success: false,
        data: null,
        error: "SERVER_ERROR",
      });
    }
  };
