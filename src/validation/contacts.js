import Joi from 'joi';

const sum = Joi.string().min(3).max(20);

export const createContactSchema = Joi.object({
  name: sum.required(),
  phoneNumber: sum.required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: sum,
  phoneNumber: sum,
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);
