const AWS = require("../utils/awssdk")
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { generatePassword } = require("../utils/helper");
const ec2 = new AWS.EC2();

const deploy = async (imageId, instanceType, keyName,name) => {
    try {
      const instanceParams = {
        ImageId: imageId,
        InstanceType: instanceType,
        KeyName: keyName,
        MinCount: 1,
        MaxCount: 1
      };
      const { Instances } = await ec2.runInstances(instanceParams).promise();
      const [{ InstanceId }] = Instances;
      await ec2.createTags({
        Resources: [InstanceId],
        Tags: [
          {
            Key: 'Name',
            Value: name
          }
        ]
      }).promise();
      console.log('Instance created:', InstanceId);
      return Instances;
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error);
    }
};

const stop = async (instanceId) => {
  try {
    const { StoppingInstances } = await ec2.stopInstances({ InstanceIds: [instanceId] }).promise();
    console.log('Instance stopped:', instanceId);
    return StoppingInstances;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

const restart = async (instanceId) => {
  try {
    const { StartingInstances } = await ec2.startInstances({ InstanceIds: [instanceId] }).promise();
    console.log('Instance restarted:', instanceId);
    return StartingInstances;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

const terminate = async (instanceId) => {
  try {
    const { TerminatingInstances } = await ec2.terminateInstances({ InstanceIds: [instanceId] }).promise();
    console.log('Instance terminated:', instanceId);
    return TerminatingInstances;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

const describeInstances = async(instaceId) => {
  try{
    const { PublicIpAddress } = await ec2.describeInstances({
      InstanceIds: [instaceId]
    }).promise().then(data => data.Reservations[0].Instances[0].NetworkInterfaces[0]);

    // Create login credentials for the EC2 instance
    const username = 'ec2-user'; // The default username for Linux instances
    const password = generatePassword(); // Use a password generator to create a strong password

    return {
      instaceId,
      PublicIpAddress,
      Username: username,
      Password: password
    };
  }catch(error){
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
}

const getCost = async (instanceIds) => {
    const params = {
    TimePeriod: {
        Start: '2022-02-01',
        End: '2022-02-28'
    },
    Granularity: 'DAILY',
    Metrics: ['UnblendedCost'],
    Filter: {
        Dimensions: {
        Key: 'ResourceId',
        Values: instanceIds
        }
    }
    };
    ec2.getCostAndUsage(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(data);
    }
    });

}

module.exports = {
    deploy,
    stop,
    restart,
    terminate,
    describeInstances
}