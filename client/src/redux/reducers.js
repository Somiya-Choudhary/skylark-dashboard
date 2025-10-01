import { combineReducers } from "redux";
import { userReducer } from "./userReducer";

// combine them
export const rootReducer = combineReducers({
  user: userReducer, // state.user
//   auth: authReducer,       // state.auth
});
