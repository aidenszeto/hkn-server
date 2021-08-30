const express = require("express");
const { check, body, validationResult } = require("express-validator");
const userController = require("./user.controller")();

const router = express.Router();

router.post(
  "/signup",
  body("uclaEmail", "Invalid ucla email").isEmail(),
  body("personalEmail", "Invalid personal email").isEmail(),
  body("passwordCheck").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    } else {
      return true;
    }
  }),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase character")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase character")
    .matches(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/)
    .withMessage("Password must contain one special character"),
  userController.signup
);

router.post("/login", userController.login);

router.get("/", userController.get);

module.exports = router;
