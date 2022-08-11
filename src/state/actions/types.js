function genSubActions(reducerName, subActions) {
  const result = { BASE: reducerName + ' ' };
  subActions.forEach(sub => result[sub] = result.BASE + sub);
  return result;
}

const timeline = genSubActions("timeline", ["setRepaintCallback"]);
const activities = genSubActions("activities", []);

export { timeline, activities };
