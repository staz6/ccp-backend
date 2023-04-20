const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ec2Service, userService } = require('../services');

const deploy = catchAsync(async (req, res) => {
    const {imageId,instanceType,name} = req.body
    const result = await ec2Service.deploy(imageId,instanceType,`${req.user.organization}-${req.user.username}-${name}`)
    const data = result.Instances
    await userService.addEc2Instance(req.user.id,data[0].InstanceId,data[0].InstanceType,`${req.user.organization}-${req.user.username}-${name}`,data[0].LaunchTime, data[0].Placement.AvailabilityZone,result.KeyMaterial)
    res.status(httpStatus.CREATED).send( result );
});

const stop = catchAsync(async (req, res) => {
    const {instanceId} = req.body
    const data = await ec2Service.stop(instanceId)
    await userService.deleteUserEc2Instance(req.user.id,instanceId,'stopped')
    res.status(httpStatus.OK).send({ data });
});

const restart = catchAsync(async (req, res) => {
    const {instanceId} = req.body
    const data = await ec2Service.restart(instanceId)
    await userService.deleteUserEc2Instance(req.user.id,instanceId,'running')
    res.status(httpStatus.OK).send({ data });
});

const terminate = catchAsync(async (req, res) => {
    const {instanceId} = req.body
    const data = await ec2Service.terminate(instanceId)
    await userService.deleteUserEc2Instance(req.user.id,instanceId,'terminated')
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