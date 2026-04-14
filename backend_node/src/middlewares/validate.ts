import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, ZodType } from "zod";

export type ValidationSchema = {
  body?: ZodObject;
  params?: ZodObject;
  query?: ZodObject;
  cookies?: ZodObject;
  file?: ZodType;
  files?: ZodType;
};

export const validate =
  (schema: ValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body ?? {});
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params) as typeof req.params;
      }
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        Object.assign(req.query, parsedQuery);
      }
      if (schema.cookies) {
        req.cookies = schema.cookies.parse(req.cookies) as typeof req.cookies;
      }
      if (schema.file) {
        req.file = schema.file.parse(req.file) as Express.Multer.File;
      }
      if (schema.files) {
        req.files = schema.files.parse(req.files) as Express.Multer.File[];
      }

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
