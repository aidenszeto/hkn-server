const { validationResult } = require("express-validator");
const userService = require("./user.service")();
const { getUserToken, passGenService } = require("../../utils/auth.utils");

const userController = () => {
  signup = async (req, res, next) => {
    try {
      // Handle express validation errors
      const validationErr = validationResult(req);
      if (!validationErr.isEmpty()) {
        const err = {
          message: validationErr.errors[0].msg,
          status: 400,
        };
        next(err);
      }

      const { firstName, lastName, uclaEmail, personalEmail, password } =
        req.body;

      if (
        userService.findByUCLAEmail(uclaEmail) ||
        userService.findByPersonalEmail(personalEmail)
      ) {
        const err = {
          message: "Account with provided email already exists",
          status: 400,
        };
        next(err);
      }

      const encryptedPassword = await passGenService(password);

      const user = {
        firstName: firstName,
        lastName: lastName,
        uclaEmail: uclaEmail,
        personalEmail: personalEmail,
        password: encryptedPassword,
      };

      const newUser = userService.create(user);
      const token = getUserToken({ id: newUser.id });

      res.status(200).send({
        newUser,
        token,
      });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    res.status(200).send("success");
  };

  return {
    signup,
    get,
  };
};

module.exports = userController;
