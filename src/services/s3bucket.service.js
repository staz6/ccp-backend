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
      console.log(data)
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
      const result = data.Contents.map((item) => {
        const url = s3.getSignedUrl('getObject', {
          Bucket: bucketName,
          Key: item.Key,
          Expires: 60 * 60 // Access link expiry time in seconds (1 hour in this example)
        });
        return {
          Key: item.Key,
          LastModified: item.LastModified,
          ETag: item.ETag,
          ChecksumAlgorithm: [],
          Size: item.Size,
          StorageClass: item.StorageClass,
          Url: url
        };
      });
      return result;
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