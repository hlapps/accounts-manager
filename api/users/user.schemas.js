'use strict';

const Joi = require('joi');

const create = Joi.object({
  origin: Joi.string().required(),
  user: Joi.object().required().keys({
    username: Joi.string().alphanum().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    appCode: Joi.string().required()
  })
});

const auth = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required(),
    password: Joi.string().required()
  }),
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
);

module.exports = {
  create,
  auth
};