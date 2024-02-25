import { NextFunction, Request, Response } from "express";
import { validationResult, Result } from "express-validator";

export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result:Result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json(result.array());
  }
  next();
};