const Joi = require("joi");

/**
 * @desc Validatins for auth routes
 */

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    gender: Joi.string().required(),
    dob: Joi.string().required(),
    dp: Joi.string().allow('').optional(),
    password: Joi.string().required(),
    country: Joi.string().required(),
    username: Joi.string().required(),
    cover: Joi.string().allow('').optional(),
    about_me: Joi.string().allow('').optional(),
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
