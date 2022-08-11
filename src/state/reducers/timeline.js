import { timeline as types } from "../actions/types";

const defaultState = {
  repaint: null
};

function timeline(state = defaultState, { type, payload }) {
  if (!type.startsWith(types.BASE)) return state;

  switch (type) {
    case types.setRepaintCallback:
      return { ...state, repaint: payload };
  }

  console.warn("unrecognized sub-action '" + type + "'!");
  return state;
}

export default timeline;
