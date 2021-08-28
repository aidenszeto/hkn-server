const AWS = require("aws-sdk");
const config = require("../../config/aws");
const { v4: uuidv4 } = require("uuid");

const create = (user, cb) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  user.id = uuidv4();
  var params = {
    TableName: config.aws_table_name_users,
    Item: user,
  };
  docClient.put(params, function (err) {
    if (err) {
      cb({
        status: err.statusCode,
        message: err.code,
      });
    } else {
      cb(user);
    }
  });
};

const findByUCLAEmail = (uclaEmail) => {
  // TODO: search dynamo table for ucla email
  return false;
};

const findByPersonalEmail = (personalEmail) => {
  // TODO: search dynamo table for personal email
  return false;
};

module.exports = {
  create,
  findByUCLAEmail,
  findByPersonalEmail,
};
