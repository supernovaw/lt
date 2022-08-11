import { useEffect, useRef } from "react";
import useDispatchers from "../state/useDispatchers";
import "./Timeline.css";
import render from "../timelineRenderer";

const ease = t => 1 - Math.pow(1 - t, 3);
const rangeTransitionPeriod = 300;

// This object template manages basic state (range) of <Timeline />
const createTimelineInitial = (element, time, span) => ({
  range: [time - span / 2, time + span / 2],
  rangeLast: null, // previous state used for transitioning
  rangeChangedAt: 0,
  transitionPeriodExpired: true,
  mouseX: 10,
  calcRange() { // returns this.range or animated value if changed recently
    if (this.transitionPeriodExpired) return this.range;
    const elapsed = new Date().getTime() - this.rangeChangedAt;
    if (elapsed > rangeTransitionPeriod) {
      this.transitionPeriodExpired = true;
      return this.range;
    }
    const t = elapsed / rangeTransitionPeriod;
    const tween = (v1, v2) => v1 + (v2 - v1) * ease(t);
    const r1 = this.rangeLast, r2 = this.range;
    return [
      tween(r1[0], r2[0]),
      tween(r1[1], r2[1])
    ];
  },
  repaint() { requestAnimationFrame(() => this.paint()) },
  onMouseMove(e) {
    this.mouseX = e.x;
    this.repaint();
  },
  onWheel(e) {
    e.preventDefault();
    const r = this.calcRange();

    const span = r[1] - r[0];
    const z = Math.exp(e.deltaY / 200);
    const spanZ = span * z;
    const mf = e.x / e.target.clientWidth; // mouse pos fraction (0=start 1=end)
    const mAt = r[0] + mf * (r[1] - r[0]);

    this.rangeLast = [...r];
    this.rangeChangedAt = new Date().getTime();
    this.transitionPeriodExpired = false;
    this.range[0] = mAt - spanZ * mf;
    this.range[1] = mAt + spanZ * (1 - mf);

    this.repaint();
  },
  onResize() {
    const dpr = this.dpr();
    element.width = dpr * element.parentElement.clientWidth;
    element.height = dpr * 200;
    this.repaint();
  },
  paint() {
    const g = element.getContext("2d");
    const dpr = this.dpr();
    const w = element.clientWidth;
    const h = element.clientHeight;
    g.resetTransform();
    g.scale(dpr, dpr);
    g.clearRect(0, 0, w, h);
    render.call(this, g, w, h);
    if (!this.transitionPeriodExpired) this.repaint();
  },
  dpr() {
    const ua = window.navigator.userAgent;
    const assumeSpoofing = ua.includes("rv:91.0") && ua.includes("Firefox/91.0");
    const dpr = window.devicePixelRatio || 1;
    if (assumeSpoofing) return dpr * 2;
    return dpr;
  },
});

const Timeline = () => {
  const canvasRef = useRef(null);
  const listenersRef = useRef(null);
  const { timelineDispatchers } = useDispatchers();

  useEffect(() => { // on (re)creation
    const canvas = canvasRef.current;

    // remove previous listeners
    if (listenersRef.current) {
      const { mousemove, wheel, resize } = listenersRef.current;
      canvas.removeEventListener("mousemove", mousemove);
      canvas.removeEventListener("wheel", wheel);
      window.removeEventListener("resize", resize);
    }

    // migrate old range and mouse pos values
    const newTl = createTimelineInitial(canvas, new Date().getTime(), 24 * 3600 * 1000);
    const oldTl = canvas.timeline;
    if (oldTl) {
      newTl.range = oldTl.range;
      newTl.mouseX = oldTl.mouseX;
    }
    const tl = newTl;
    canvas.timeline = tl;
    tl.onResize();
    timelineDispatchers.setRepaintCallback(() => tl.repaint());

    // init listeners
    const mousemove = e => tl.onMouseMove(e);
    const wheel = e => tl.onWheel(e);
    const resize = e => tl.onResize(e);
    listenersRef.current = { mousemove, wheel, resize };
    canvas.addEventListener("mousemove", mousemove);
    canvas.addEventListener("wheel", wheel);
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize); // in case it is ever unmounted
  }, []);

  return <canvas className="Timeline" ref={canvasRef} height={200} style={{ width: "100%", height: "200px" }} />
};

export default Timeline;
