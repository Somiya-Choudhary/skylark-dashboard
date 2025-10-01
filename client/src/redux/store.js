import { createStore } from "redux";
import { rootReducer } from "./reducers";

// create store with combined reducers
export const store = createStore(rootReducer);