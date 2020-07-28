import { body, validationResult } from "express-validator";
import { ErrorHandler } from "./utils";

// validation rule
export const validationRules = [
  body("*.address_line_one").isString().notEmpty(),
  body("*.city").isString().notEmpty(),
  body("*.state").isString().notEmpty(),
  body("*.zip_code").isPostalCode("US").notEmpty(),
];

// handlt validation error, if there a no error
// continue, but if there are errors throw an error
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
