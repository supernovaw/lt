import moment from "moment";

const startOfWeek = 1; // 0=Sunday 1=Monday etc

const scaleLevels = [
  {
    name: "1-s",
    unitSizeS: 1,
    nextMoment: t => t - t % 1000 + 1000,
    format: "HH:mm:ss"
  }, {
    name: "10-s",
    unitSizeS: 10,
    nextMoment: t => t - t % 10_000 + 10_000,
    format: "HH:mm:ss"
  }, {
    name: "1-min",
    unitSizeS: 60,
    nextMoment: t => t - t % 60_000 + 60_000,
    format: "HH:mm"
  }, {
    name: "5-min",
    unitSizeS: 5 * 60,
    nextMoment: t => t - t % 300_000 + 300_000,
    format: "HH:mm"
  }, {
    name: "15-m",
    unitSizeS: 15 * 60,
    nextMoment: t => t - t % 900_000 + 900_000,
    format: "HH:mm"
  }, {
    name: "1-hr",
    unitSizeS: 3600,
    nextMoment: t => moment(t).startOf("hour").add(1, "hour").unix() * 1000,
    format: "HH:mm"
  }, {
    name: "6-hr",
    unitSizeS: 6 * 3600,
    nextMoment: t => { const m = moment(t); const hr = m.get("hour"); return m.startOf("day").set("hour", hr - hr % 6 + 6).unix() * 1000 },
    format: "MM-DD HH:mm"
  }, {
    name: "1-d",
    unitSizeS: 86_400,
    nextMoment: t => moment(t).startOf("day").add(1, "day").unix() * 1000,
    format: "MM-DD ddd"
  }, {
    name: "1-w",
    unitSizeS: 7 * 86_400,
    nextMoment: t => moment(t).subtract(startOfWeek, "day").startOf("week").add(7 + startOfWeek, "day").unix() * 1000,
    format: "MM-DD"
  }, {
    name: "1-m",
    unitSizeS: 30 * 86_400,
    nextMoment: t => moment(t).startOf("month").add(1, "month").unix() * 1000,
    format: "YYYY MMM"
  }, {
    name: "1-y",
    unitSizeS: 365 * 86_400,
    nextMoment: t => moment(t).startOf("year").add(1, "year").unix() * 1000,
    format: "YYYY"
  }, {
    name: "10-y",
    unitSizeS: 3652 * 86_400,
    nextMoment: t => { const m = moment(t); const yr = m.get("year"); return m.startOf("year").set("year", yr - yr % 10 + 10).unix() * 1000 },
    format: "YYYY'\\s"
  }
];

function findMatchingLevel(spanMs, width) {
  // find the biggest scale whose single unit fits within 600px
  let frameSecs = spanMs / 1000 * 600 / width;
  let index = scaleLevels.findIndex(lvl => lvl.unitSizeS > frameSecs) - 1;
  if (index === -1) index = 0; // we're looking at seconds or less
  if (index === -2) index = scaleLevels.length - 1; // we're looking at decades or more
  return index;
}

export { scaleLevels, findMatchingLevel };
