import * as joi from 'joi';

export const signupValidation = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  role: joi.string().required().valid('student', 'teacher'),
});

export const loginValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const headerValidation = joi.object({
  appApiKey: joi.string().required(),
});
