import {
  USER,
  REMOVE_USER,
  RESERVATION_DATES,
  RESERVATIONS,
  REMOVE_RESERVATION_DATES,
} from "./action.types";

export const initialState = {
  id: "",
  fullName: "",
  email: "",
  role: "",
  reservations: [],
  reservationDates: {
    reservationStartDate: null,
    reservationEndDate: null,
  },
};

export const userReducers = (state, action) => {
  switch (action.type) {
    case USER:
      return {
        ...state,
        id: action.payload.id,
        fullName: action.payload.fullName,
        email: action.payload.email,
        role: action.payload.role,
        reservations: action.payload.reservations,
      };

    case RESERVATIONS:
      return {
        ...state,
        reservations: action.payload,
      };

    case REMOVE_USER:
      return initialState;

    case RESERVATION_DATES:
      return { ...state, reservationDates: action.payload };
      
    case REMOVE_RESERVATION_DATES:
      return {
        ...state,
        reservationDates: {
          reservationStartDate: null,
          reservationEndDate: null,
        },
      };
    default:
      return state ? state : initialState;
  }
};
