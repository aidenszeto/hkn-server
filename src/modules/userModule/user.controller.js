const userController = () => {
  get = async (req, res, next) => {
    res.send("success");
  };

  return {
    get,
  };
};

module.exports = userController;
