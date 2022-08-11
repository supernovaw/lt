import renderEmptyTimeline from "./renderEmptyTimeline";

const baselineY = 150;

function timeToPos(t, range, width) {
  const f = (t - range[0]) / (range[1] - range[0]);
  return f * width;
}

function posToTime(x, range, width) {
  const f = x / width;
  return range[0] + f * (range[1] - range[0]);
}

function line(g, x1, y1, x2, y2, width) {
  let widthOld = g.lineWidth;
  if (width) g.lineWidth = width;
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
  if (width) g.lineWidth = widthOld;
}

export { baselineY, timeToPos, posToTime, line };

// this function is called on timeline's state object which has useful fields such as calcRange, mouseX
export default function render(g, w, h) {
  const r = this.calcRange();
  renderEmptyTimeline(g, w, h, r, this.mouseX);
}
