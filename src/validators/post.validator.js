const Joi = require("joi");

const postSchema = {
  body: Joi.object().keys({
    title: Joi.string().required(),
  desc: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  privacy: Joi.boolean().required(),
  }),
};
const comment = {
  body: Joi.object().keys({
    comment: Joi.string().required(),
  }),
};


module.exports={
    postSchema,comment
}