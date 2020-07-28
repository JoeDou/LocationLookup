import { body, validationResult } from "express-validator";
import { ErrorHandler } from "./utils";

export const validationRules = [
  body("*.address_line_one").isString().notEmpty(),
  body("*.city").isString().notEmpty(),
  body("*.state").isString().notEmpty(),
  body("*.zip_code").isPostalCode("US").notEmpty(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const msg = {
    message: "Bad Request",
    errors: errors.errors,
  };
  throw new ErrorHandler(400, msg);
};
