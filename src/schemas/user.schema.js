import Joi from "joi";

export const getAllUsersSchema = Joi.number().positive().required();

export const updateUserProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(4).max(100).optional(),
  password: Joi.string().min(5).max(50).optional(),
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string().trim().min(4).max(100).optional(),
  email: Joi.string().trim().email({ tlds: false }).optional(),
  role: Joi.string().optional(),
});
