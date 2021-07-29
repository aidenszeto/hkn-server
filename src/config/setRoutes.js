const userRouter = require("../modules/userModule/user.route");

const setRoutes = (app) => {
  app.use("/user", userRouter);
};

module.exports = setRoutes;
