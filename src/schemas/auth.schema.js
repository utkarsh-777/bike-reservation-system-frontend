import Joi from "joi";

export const signUpSchema = Joi.object({
  fullName: Joi.string().trim().min(4).max(100).required(),
  email: Joi.string().trim().email({ tlds: false }).required(),
  password: Joi.string().min(5).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: false }).required(),
  password: Joi.string().max(50).required(),
});

export const emailSchema = Joi.string()
  .trim()
  .email({ tlds: false })
  .required();

export const signUpPasswordSchema = Joi.string().min(5).max(50).required();

export const passwordSchema = Joi.string().max(50).required();

export const fullNameSchema = Joi.string().trim().min(4).max(100).required();
