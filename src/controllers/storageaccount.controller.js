const httpStatus = require('http-status');
const { storageaccount, userService } = require('../services');
const catchAsync = require('../utils/catchAsync');


const deploy = catchAsync(async (req, res) => {
    const result = await storageaccount.deploy(req.user.organization,req.body.name)
    await userService.addStorageACcount(req.user._id,result.id,result.creationTime,result.name)
    res.status(httpStatus.CREATED).send( result );
});
const terminate = catchAsync(async (req, res) => {
    const result = await storageaccount.deleteResource(req.user.organization,req.body.name)
    await userService.removeStorageAccount(req.body.name)
    res.status(httpStatus.CREATED).send( result );
});

const uploadFile =catchAsync(async (req,res) => {
    const result = await storageaccount.uploadFile(req.user.organization,req.body.name,req.file)
    res.status(httpStatus.CREATED).send( result );
})

const getFiles = catchAsync(async (req,res) => {
    const result = await storageaccount.listFiles(req.user.organization,req.params.saName)
    res.status(httpStatus.CREATED).send( result );
})

module.exports = {
    deploy,
    terminate,
    uploadFile,
    getFiles
}