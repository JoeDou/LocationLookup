import { body, validationResult } from "express-validator";

const validationRules = [
  body("*.address_line_one").isString().notEmpty(),
  body("*.city").isString().notEmpty(),
  body("*.state").isString().notEmpty(),
  body("*.zip_code").isPostalCode("US").notEmpty(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    errors,
  });
};

module.exports = {
  validationRules,
  validate,
};
