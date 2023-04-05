const Joi = require("joi");

const applyAsCreator = {
    body: Joi.object().keys({
      user_id: Joi.string().required(),
      email: Joi.string().email().required(),
      driving_license: Joi.string().required(),
      holding_license: Joi.string().required(),
      photos: Joi.string().required(),
    }),
};
const approvedStatus = {
    body: Joi.object().keys({
    status: Joi.string().required(),
    }),
};

module.exports={
    applyAsCreator,
    approvedStatus
}