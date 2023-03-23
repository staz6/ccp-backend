const config = require('../config/config');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  region: config.aws.region
});
module.exports = AWS