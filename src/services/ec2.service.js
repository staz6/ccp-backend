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

async function getEC2InstanceCost(instanceIds) {
  const ec2 = new AWS.EC2();
  const cloudwatch = new AWS.CloudWatch();
  const pricing = new AWS.Pricing();

  // Use the DescribeInstances API to retrieve the instance details
  const describeInstancesParams = {
    InstanceIds: instanceIds
  };
  const describeInstancesResponse = await ec2.describeInstances(describeInstancesParams).promise();

  // Extract the instance types from the response
  const instanceTypes = describeInstancesResponse.Reservations.flatMap(reservation => {
    return reservation.Instances.map(instance => instance.InstanceType);
  });

  // Get the start date and end date for the billing period
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
  const endDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Current date + 1 day

  // Use the CloudWatch API to retrieve the usage metrics for the instances
  const cloudwatchParams = {
    MetricName: 'EstimatedCharges',
    Namespace: 'AWS/Billing',
    Dimensions: [
      {
        Name: 'ServiceName',
        Value: 'Amazon Elastic Compute Cloud - Compute'
      },
      {
        Name: 'UsageType',
        Value: 'BoxUsage'
      }
    ],
    StartTime: startDate,
    EndTime: endDate,
    Period: 86400, // 1 day
    Statistics: ['Maximum']
  };
  const cloudwatchResponse = await cloudwatch.getMetricData(cloudwatchParams).promise();

  // Extract the maximum charges for the instances from the CloudWatch response
  const instanceCosts = {};
  cloudwatchResponse.MetricDataResults.forEach( async (metricData) => {
    const instanceId = metricData.Label.split(' ')[1];
    if (!instanceIds.includes(instanceId)) {
      return;
    }
    const instanceType = describeInstancesResponse.Reservations.find(reservation => {
      return reservation.Instances.some(instance => instance.InstanceId === instanceId);
    }).Instances[0].InstanceType;
    const usageHours = metricData.Values[0].Timestamps.length;
    const maxCharge = metricData.Values[0].Max;
    const hourlyRate = await getInstanceHourlyRate(pricing, instanceType);
    const instanceCost = usageHours * hourlyRate * 100; // Convert to cents
    instanceCosts[instanceId] = instanceCost;
  });

  // Calculate the total monthly cost
  const totalCost = Object.values(instanceCosts).reduce((acc, cur) => acc + cur, 0) / 100;

  return {
    instanceCosts: instanceCosts,
    totalCost: totalCost
  };
}

async function getInstanceHourlyRate(pricing, instanceType) {
  const getProductsParams = {
    ServiceCode: 'AmazonEC2',
    Filters: [
      {
        Type: 'TERM_MATCH',
        Field: 'instanceType',
        Value: instanceType
      }
    ]
  };
  const getProductsResponse = await pricing.getProducts(getProductsParams).promise();
  const product = getProductsResponse.PriceList[0];
  const hourlyRate = parseFloat(JSON.parse(product).terms.OnDemand[Object.keys(JSON.parse(product).terms.OnDemand)[0]].priceDimensions[Object.keys(JSON.parse(product).terms.OnDemand)[0]].pricePerUnit.USD);
  return hourlyRate;
}

const getCost = async (instanceIds) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().substring(0, 10); // First day of the month
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().substring(0, 10); // Last day of the month

  const params = {
    TimePeriod: {
      Start: startDate,
      End: endDate
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

  const ce = new AWS.CostExplorer();
  const data = await ce.getCostAndUsage(params).promise();
  console.log(data);
  return data;
}

module.exports = {
    deploy,
    stop,
    restart,
    terminate,
    describeInstances,
    getEC2InstanceCost,
    getCost
}