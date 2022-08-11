import moment from "moment";
import { findMatchingLevel, scaleLevels } from "./scaleLevels";
import { baselineY, timeToPos, posToTime, line } from ".";

// render baseline, markers with time labels, cursor, cursor time (bottom left)
export default function renderEmptyTimeline(g, w, h, r, mouseX) { // graphics (context), width, height, range, mouseX
  const mouseT = posToTime(mouseX, r, w);
  const levelIndex = findMatchingLevel(r[1] - r[0], w);
  const mainLevel = scaleLevels[levelIndex];
  const secondaryLevel = scaleLevels[levelIndex - 1];
  g.strokeStyle = "#ffffff";
  g.fillStyle = "#ffffff";

  // main line
  line(g, 0, baselineY, w, baselineY);

  // highlight current day
  const dayStart = moment().startOf("day");
  const dayEnd = moment().startOf("day").add(1, "day");
  const dayStartX = timeToPos(dayStart, r, w);
  const dayEndX = timeToPos(dayEnd, r, w);
  line(g, dayStartX - 1, baselineY, dayEndX + 1, baselineY, 2);

  // main level markers
  for (let t = r[0], limit = 100; t < r[1] && limit > 0; limit--) {
    t = mainLevel.nextMoment(t);
    const x = timeToPos(t, r, w);
    line(g, x, baselineY - 4, x, baselineY + 4);
    g.fillText(moment(t).format(mainLevel.format), x, baselineY - 5);
  }

  // secondary level markers (smaller, more numerous)
  if (secondaryLevel) {
    for (let t = r[0], limit = 1000; t < r[1] && limit > 0; limit--) {
      t = secondaryLevel.nextMoment(t);
      const x = timeToPos(t, r, w);
      line(g, x, baselineY - 2, x, baselineY + 2);
    }
  }

  // cursor timestamp
  line(g, mouseX, baselineY - 10, mouseX, baselineY); // marker
  g.fillText(moment(mouseT).format("YYYY-MM-DD HH:mm:ss ZZ (ddd)"), 5, h - 5);
}
