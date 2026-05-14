import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

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
        req.query = validatedData.query as Request["query"];
      }

      if (validatedData.params) {
        req.params = validatedData.params as Request["params"];
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          data: null,
          errors: err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      next(err);
    }
  };
