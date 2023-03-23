const AWS = require("../utils/awssdk")
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const s3 = new AWS.S3();
async function createPublicBucket(bucketName) {
    const params = {
      Bucket: bucketName.toLowerCase(),
      ACL: 'public-read'
    };
    
    try {
      const data = await s3.createBucket(params).promise();
      console.log(`Bucket ${bucketName} created successfully.`);
      return data;
    } catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, err);
    }
}

async function listBucketObjects(bucketName) {
    const params = {
      Bucket: bucketName
    };
    
    try {
      const data = await s3.listObjectsV2(params).promise();
    //   const objects = data.Contents.map((object) => object.Key);
      return data;
    } catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, err);
    }
}

async function uploadFile(params) {
  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully.`);
    return data;
  } catch (err) {
      throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
}

module.exports = {
    createPublicBucket,
    listBucketObjects,
    uploadFile
}