const AWS = require("aws-sdk");
const config = require("../../config/aws");
const { v4: uuidv4 } = require("uuid");

const create = (user, cb) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  user.id = uuidv4();
  const params = {
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

const getAll = (cb) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.aws_table_name_users,
  };
  docClient.scan(params, function (err, data) {
    if (err) {
      cb({
        status: err.statusCode,
        message: err.code,
      });
    } else {
      cb(data);
    }
  });
};

const findByUCLAEmail = (uclaEmail, cb) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.aws_table_name_users,
    FilterExpression: "#ucla = :ucla",
    ExpressionAttributeNames: {
      "#ucla": "uclaEmail",
    },
    ExpressionAttributeValues: {
      ":ucla": uclaEmail,
    },
  };
  docClient.scan(params, function (err, data) {
    if (err) {
      cb({
        status: err.statusCode,
        message: err.code,
      });
    } else {
      cb(data);
    }
  });
};

const findByPersonalEmail = (personalEmail, cb) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.aws_table_name_users,
    FilterExpression: "#personal = :personal",
    ExpressionAttributeNames: {
      "#personal": "personalEmail",
    },
    ExpressionAttributeValues: {
      ":personal": personalEmail,
    },
  };
  docClient.scan(params, function (err, data) {
    if (err) {
      cb({
        status: err.statusCode,
        message: err.code,
      });
    } else {
      cb(data);
    }
  });
};

const checkExisting = (uclaEmail, personalEmail, cb) => {
  findByUCLAEmail(uclaEmail, (err, data) => {
    if (err.Count === 0 && !data) {
      findByPersonalEmail(personalEmail, (err, data) => {
        if (err.Count === 0 && !data) {
          cb(false);
        } else {
          cb(true);
        }
      });
    } else {
      cb(true);
    }
  });
};

module.exports = {
  create,
  getAll,
  checkExisting,
};
