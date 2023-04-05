const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ec2Service, userService } = require('../services');

const deploy = catchAsync(async (req, res) => {
    const {imageId,instanceType,keyName,name} = req.body
    const data = await ec2Service.deploy(imageId,instanceType,keyName,`${req.user.organization}-${req.user.username}-${name}`)
    console.log(data)
    await userService.addEc2Instance(req.user.id,data[0].InstanceId,data[0].InstanceType,`${req.user.organization}-${req.user.username}-${name}`,data[0].LaunchTime, data[0].Placement.AvailabilityZone)
    res.status(httpStatus.CREATED).send( data );
});

const stop = catchAsync(async (req, res) => {
    const {instanceId} = req.body
    const data = await ec2Service.stop(instanceId)
    res.status(httpStatus.OK).send({ data });
});

const restart = catchAsync(async (req, res) => {
    const {instanceId} = req.body
    const data = await ec2Service.restart(instanceId)
    res.status(httpStatus.OK).send({ data });
});

const terminate = catchAsync(async (req, res) => {
    const {instanceId} = req.body
    const data = await ec2Service.terminate(instanceId)
    await userService.deleteUserEc2Instance(req.user.id,instanceId)
    res.status(httpStatus.OK).send({ data });
});

const describeInstances = catchAsync(async (req, res) => {
    const {instanceId} = req.body
    const data = await ec2Service.describeInstances(instanceId)
    res.status(httpStatus.OK).send({ data });
});

const getCost = catchAsync(async (req, res) => {
    const {instanceIds} = req.body
    const data = await ec2Service.getCost(instanceIds)
    res.status(httpStatus.OK).send({ data });
});



module.exports={
    deploy,
    stop,
    restart,
    terminate,
    describeInstances,
    getCost
}