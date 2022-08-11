import { activities as types } from "../actions/types";

function activities(state = [], { type, payload }) {
  if (!type.startsWith(types.BASE)) return state;

  switch (type) {
    
  }

  console.warn("unrecognized sub-action '" + type + "'!");
  return state;
}

export default activities;
