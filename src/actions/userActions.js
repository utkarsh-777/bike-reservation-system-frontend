import {
  USER,
  REMOVE_USER,
  RESERVATION_DATES,
  RESERVATIONS,
  REMOVE_RESERVATION_DATES,
} from "../reducers/action.types";

export const user = (user) => {
  return { type: USER, payload: { ...user } };
};

export const remove_user = () => {
  return { type: REMOVE_USER };
};

export const reservations = (reservations) => {
  return { type: RESERVATIONS, payload: reservations };
};

export const reservation_dates = (reservationDates) => {
  return { type: RESERVATION_DATES, payload: reservationDates };
};

export const remove_reservation_dates = () => {
  return { type: REMOVE_RESERVATION_DATES };
};
