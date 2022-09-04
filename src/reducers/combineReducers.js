import { userReducers } from "./userReducers";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  user: userReducers,
});
