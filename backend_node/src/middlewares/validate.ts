import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

type Schema = {
  body?: ZodObject;
  params?: ZodObject;
  query?: ZodObject;
  cookies?: ZodObject;
};

export const validate =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.params) schema.params.parse(req.params);
      if (schema.query) schema.query.parse(req.query);
      if (schema.cookies) schema.cookies.parse(req.cookies);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: err.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      next(err);
    }
  };
