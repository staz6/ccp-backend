const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { s3Service, userService } = require('../services');

const deploy = catchAsync(async (req, res) => {
    const {bucketName} = req.body
    const data = await s3Service.createPublicBucket(`${req.user.organization}-${req.user.username}-${bucketName}`)
    await userService.adds3Bucket(req.user.id,`${req.user.organization}-${req.user.username}-${bucketName}`.toLowerCase())
    res.status(httpStatus.CREATED).send( data );
});

const getFiles = catchAsync(async (req, res) => {
    const {bucketName} = req.params
    const data = await s3Service.listBucketObjects(bucketName)
    res.status(httpStatus.OK).send( data );
});

const upload = catchAsync(async (req, res) => {
    const params = {
        Bucket: req.body.name,
        Key: req.file.originalname,
        Body: req.file.buffer,
        // ACL: 'public-read'
      };
    console.log(params)
    const data = await s3Service.uploadFile(params)
    res.status(httpStatus.CREATED).send( data );
});

module.exports={
    deploy,
    getFiles,
    upload
}