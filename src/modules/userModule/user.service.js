const { v4: uuidv4 } = require("uuid");

const userService = () => {
  create = (user) => {
    user.id = uuidv4();
    // TODO: add to dynamo table
    return user;
  };

  findByUCLAEmail = (uclaEmail) => {
    // TODO: search dynamo table for ucla email
    return false;
  };

  findByPersonalEmail = (personalEmail) => {
    // TODO: search dynamo table for personal email
    return false;
  };

  return {
    create,
    findByUCLAEmail,
    findByPersonalEmail,
  };
};

module.exports = userService;
