import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const reqwestPasswordRethet = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassword = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});
