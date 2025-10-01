import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { camerasReducer } from "./camerasReducer";

// combine them
export const rootReducer = combineReducers({
  user: userReducer, // state.user
  cameras: camerasReducer,
});
