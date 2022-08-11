import { useDispatch } from "react-redux";

import timelineCreators from "./actions/timelineCreators";

export default function useDispatchers() {
  const d = useDispatch();
  return {
    timelineDispatchers: {
      setRepaintCallback: fn => d(timelineCreators.setRepaintCallback(fn)),
    },
  }
}
