const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const user = await userService.authenticateUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.status(httpStatus.CREATED).send(user);
}); 

module.exports={
    register,
    login,
    getUser
}