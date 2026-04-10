import { Response } from "express";

export function ok<T>(
  res: Response,
  data: T,
  message = "Success"
) {
  return res.json({
    success: true,
    message,
    data,
  });
}

export function created<T>(
  res: Response,
  data: T,
  message = "Created successfully"
) {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

export function noContent(res: Response) {
  return res.status(204).send();
}