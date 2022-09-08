import { USER, REMOVE_USER } from "../context/action.types";

export const user = (user) => {
  return { type: USER, payload: { ...user } };
};

export const remove_user = () => {
  return { type: REMOVE_USER };
};
