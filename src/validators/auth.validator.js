const Joi = require("joi");

/**
 * @desc Validatins for auth routes
 */

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    organization: Joi.string().required(),
    username: Joi.string().required(),
    
  }),
};


const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
};
