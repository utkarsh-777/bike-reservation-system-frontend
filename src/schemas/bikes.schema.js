import Joi from "joi";
import moment from "moment";

export const addBikeSchema = Joi.object({
  model: Joi.string().trim().min(2).max(100).required(),
  color: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  isAvailableAdmin: Joi.boolean().required(),
});

export const addUserSchema = Joi.object({
  fullName: Joi.string().trim().min(4).max(100).required(),
  email: Joi.string().trim().email({ tlds: false }).required(),
  password: Joi.string().trim().min(5).max(50).trim().required(),
  role: Joi.string().trim().required(),
});

export const filterBikesSchema = Joi.object({
  reservationStartDate: Joi.date()
    .min(moment().startOf("day"))
    .message("Start date cannot be a past day!")
    .required(),
  reservationEndDate: Joi.date()
    .min(Joi.ref("reservationStartDate"))
    .required(),
  page: Joi.number().positive().required(),
  model: Joi.string().trim().optional(),
  color: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  minAvgRating: Joi.number().min(0).max(5).optional(),
});

export const reserveBikeSchema = Joi.object({
  bikeId: Joi.number().positive().required(),
  reservationStartDate: Joi.date()
    .min(moment().startOf("day"))
    .message("Reservation start date should not be a past today!")
    .required(),
  reservationEndDate: Joi.date()
    .min(Joi.ref("reservationStartDate"))
    .required(),
});

export const updateBikeSchema = Joi.object({
  bikeId: Joi.number().positive().required(),
  model: Joi.string().trim().min(2).max(100).required(),
  color: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  isAvailable: Joi.boolean().required(),
});

export const getBikeReservationsSchema = Joi.object({
  bikeId: Joi.number().positive().required(),
  page: Joi.number().positive().required(),
});

export const modelSchema = Joi.string().trim().min(2).max(100).required();

export const colorSchema = Joi.string().trim().required();

export const locationSchema = Joi.string().trim().required();

export const getUsersSchema = Joi.number().positive().required();
