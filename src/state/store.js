import { combineReducers, createStore } from "redux";

import timeline from "./reducers/timeline";
import activities from "./reducers/activities"

const store = createStore(combineReducers({
  timeline,
  activities,
}));

export default store;
