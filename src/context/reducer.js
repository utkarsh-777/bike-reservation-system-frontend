import { USER, REMOVE_USER } from "./action.types";

export const initialState = {
  id: "",
  fullName: "",
  email: "",
  role: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case USER:
      return action.payload;
    case REMOVE_USER:
      return initialState;
    default:
      return state;
  }
};
