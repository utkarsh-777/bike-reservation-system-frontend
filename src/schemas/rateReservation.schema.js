import Joi from "joi";

export const rateReservationSchema = Joi.object({
  reservationId: Joi.number().positive().required(),
  comment: Joi.string().trim().min(1).max(200).required(),
  rating: Joi.number().positive().min(1).max(5).required(),
});

export const cancelReservationSchema = Joi.number().positive().required();
