import { timeline as types } from "./types";

export default {
  setRepaintCallback: fn => ({ type: types.setRepaintCallback, payload: fn })
};
