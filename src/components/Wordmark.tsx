import { useLayoutEffect, useRef, useState } from "react";
import { sec } from "../router";
import Pen from "./Pen";
import { CAP, WORDMARK_GLYPHS } from "./wordmarkStrokes";

const KEY = "nickora-logo-written";
const WRITE_MS = 1900;
const TEXT = "NICKORA";

type Glyph = { x: number; y: number; s: number };

// The header logo. On a visitor's first page load of the session, a small fountain pen writes
// "NICKORA" stroke by stroke exactly over the real text, which then takes over.
export default function Wordmark() {
  const [play] = useState(() => {
    try {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      return !sessionStorage.getItem(KEY);
    } catch { return false; }
  });
  const [phase, setPhase] = useState<"write" | "done">(play ? "write" : "done");
  const [layout, setLayout] = useState<Glyph[] | null>(null);
  const box = useRef<HTMLAnchorElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const pen = useRef<HTMLDivElement>(null);

  // Place each letter's strokes over the matching character of the real text.
  useLayoutEffect(() => {
    if (!play) return;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage may be blocked */ }
    const place = () => {
      const node = text.current!.firstChild as Text;
      const base = box.current!.getBoundingClientRect();
      const css = getComputedStyle(text.current!);
      const fs = parseFloat(css.fontSize), ls = parseFloat(css.letterSpacing) || 0;
      const capPx = fs * 0.72, s = capPx / CAP;
      const span = text.current!.getBoundingClientRect();
      const top = span.top - base.top + (span.height - capPx) / 2 + fs * 0.03;
      const out: Glyph[] = [];
      for (let i = 0; i < TEXT.length; i++) {
        const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
        const b = r.getBoundingClientRect();
        const centre = b.left - base.left + (b.width - ls) / 2;
        out.push({ x: centre - (WORDMARK_GLYPHS[i].w * s) / 2, y: top, s });
      }
      setLayout(out);
    };
    document.fonts?.ready.then(place);
    place();
  }, [play]);

  // Write the strokes in order, moving the pen nib along the line being drawn.
  useLayoutEffect(() => {
    if (!play || !layout || phase !== "write") return;
    const paths = [...svg.current!.querySelectorAll<SVGPathElement>("path")];
    const lens = paths.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    paths.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]} ${lens[i]}`; p.style.strokeDashoffset = `${lens[i]}`; });
    let raf = 0;
    const start = performance.now() + 350;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min((now - start) / WRITE_MS, 1));
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      let dist = e * total, i = 0;
      for (; i < paths.length && dist > lens[i]; i++) { paths[i].style.strokeDashoffset = "0"; dist -= lens[i]; }
      if (i < paths.length) {
        paths[i].style.strokeDashoffset = `${lens[i] - dist}`;
        const pt = paths[i].getPointAtLength(dist).matrixTransform(paths[i].getScreenCTM()!);
        const base = box.current!.getBoundingClientRect();
        pen.current!.style.transform = `translate(${pt.x - base.left}px, ${pt.y - base.top}px)`;
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase("done");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, layout, phase]);

  const writing = play && phase === "write";

  return (
    <a ref={box} href={sec("top")} aria-label="Nickora home" className="relative block leading-none">
      <span ref={text} className="block text-[17px] font-semibold tracking-[0.32em] transition-opacity duration-500" style={{ opacity: writing ? 0 : 1 }}>{TEXT}</span>
      <span className="mt-1 block text-[12px] text-muted transition-all duration-700" style={{ opacity: writing ? 0 : 1, transform: writing ? "translateY(4px)" : "none" }}>Education Consultancy</span>

      {play && layout && (
        <>
          <svg ref={svg} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-opacity duration-500" style={{ opacity: writing ? 1 : 0 }} aria-hidden>
            {layout.map((g, i) => (
              <g key={i} transform={`translate(${g.x} ${g.y}) scale(${g.s})`}>
                {WORDMARK_GLYPHS[i].d.map((d, k) => (
                  <path key={k} d={d} fill="none" stroke="#111318" strokeWidth={2.7} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                ))}
              </g>
            ))}
          </svg>
          <div ref={pen} className="pointer-events-none absolute left-0 top-0 z-10" style={{ transform: "translate(-200px, -200px)" }} aria-hidden>
            <div className="transition-all duration-700 ease-in" style={{ transform: writing ? "scale(.3)" : "translate(60px,-60px) scale(.3)", transformOrigin: "0 0", opacity: writing ? 1 : 0 }}>
              <Pen />
            </div>
          </div>
        </>
      )}
    </a>
  );
}
