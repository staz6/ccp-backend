const httpStatus = require('http-status');
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
  console.log(user)
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password');
  }
  if(!user.isPasswordMatch(authBody.password)){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password');
  }
  return user
};

module.exports = {
    createUser,
    authenticateUser
};
  