const httpStatus = require('http-status');
const { Http } = require('winston/lib/winston/transports');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Authenticate user
 * @param {Object} {email, password}
 * @returns {Promise<User>}
 */
const authenticateUser = async (authBody) => {
  const user = await User.findOne({email: authBody.email})
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password');
  }
  if(!user.isPasswordMatch(authBody.password)){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password');
  }
  return user
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findOne({id: id})
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User doesn't exist`);
  }
  return user
};

const adds3Bucket = async(userId,bucketName) => {
  try{
    const user = await getUserById(userId)
    user.s3Buckets.push(bucketName);
    await user.save();
    return user;
  }catch(err){
    throw new ApiError(httpStatus.BAD_REQUEST,err)
  }
}

const addEc2Instance = async (userId,instanceId,tier,instanceName,launchTime,zone) => {
  try{
    const user = await getUserById(userId)
    user.ec2Instances.push({instanceId,tier,instanceName,launchTime,status:true,zone});
    await user.save();
    return user;
  }catch(err){
    throw new ApiError(httpStatus.BAD_REQUEST,err)
  }
};

const deleteUserEc2Instance = async (userId, instanceId) => {
  try {
    const user = await getUserById(userId)

    const index = user.ec2Instances.findIndex((obj) => obj.instanceId === instanceId);
    if (index >= 0) {
      user.ec2Instances[index].status=false
      await user.save();
      console.log(`Instance ${instanceId} removed from User ${userId} ec2Instances`);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND,'Instance not found')
    }
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST,error)
  }
};

module.exports = {
    createUser,
    authenticateUser,
    getUserById,
    addEc2Instance,
    deleteUserEc2Instance,
    adds3Bucket
};
  