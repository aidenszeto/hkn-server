const { validationResult } = require("express-validator");
const UserService = require("./user.service");
const {
  getUserToken,
  passGenService,
  validatePassword,
} = require("../../utils/auth.utils");

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

      UserService.checkExisting(uclaEmail, personalEmail, async (data) => {
        if (data) {
          const err = {
            message: "Account with provided email already exists",
            status: 401,
          };
          next(err);
        } else {
          const encryptedPassword = await passGenService(password);

          const user = {
            firstName: firstName,
            lastName: lastName,
            uclaEmail: uclaEmail,
            personalEmail: personalEmail,
            password: encryptedPassword,
          };

          UserService.create(user, (newUser) => {
            const token = getUserToken({ id: newUser.id });
            res.status(200).send({
              newUser,
              token,
            });
          });
        }
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { personalEmail, password } = req.body;
      UserService.getAll((data) => {
        const users = data.Items.map((user) => {
          if (user.personalEmail === personalEmail) {
            if (!validatePassword(password, user.password)) {
              const err = {
                message: "Invalid password",
                status: 401,
              };
              next(err);
            }
            const token = getUserToken(user);
            res.status(200).send({
              user,
              token,
            });
          }
        });
        if (users.length === 0) {
          const err = {
            message: "User email does not exist",
            status: 404,
          };
          next(err);
        }
      });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      UserService.getAll((data) => {
        res.status(200).send(data);
      });
    } catch (err) {
      next(err);
    }
  };

  return {
    signup,
    login,
    get,
  };
};

module.exports = userController;
